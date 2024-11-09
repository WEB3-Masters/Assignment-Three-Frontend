<template>
    <div class="game-list">
        <h2>Available Games</h2>
        <div class="rooms-container">
            <div v-if="loading" class="loading">
                Loading rooms...
            </div>
            <div v-else-if="error" class="error">
                {{ error.message }}
            </div>
            <div v-else class="rooms">
                <div v-for="room in rooms" :key="room.id" class="room-card">
                    <div class="room-info">
                        <span class="room-status" :class="room.roomState?.toLowerCase()">
                            {{ room.roomState }}
                        </span>
                        <div class="players">
                            <span>Players: {{ room.players?.length || 0 }}/{{ gameStore.MAX_PLAYERS }}</span>
                            <div class="player-list">
                                <div v-for="player in room.players" :key="player.id">
                                    {{ player.username }}
                                    {{ player.id === room.currentPlayer?.id ? '(current)' : '' }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button 
                        @click="handleJoinRoom(room.id)"
                        :disabled="isRoomUnavailable(room)"
                    >
                        {{ getJoinButtonText(room) }}
                    </button>
                </div>
                <div v-if="rooms.length === 0" class="no-rooms">
                    No games available. Create a new one!
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useGetRoomsQuery, RoomState, Room } from '../generated/graphql';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/GameStore';

const router = useRouter();
const gameStore = useGameStore();
const { result, loading, error } = useGetRoomsQuery();
const joining = ref(false);

const rooms = computed(() => result.value?.rooms || []);

function isRoomUnavailable(room: any) {
    return room.roomState === RoomState.InProgress || 
           joining.value || 
           (room.players?.length || 0) >= gameStore.MAX_PLAYERS;
}

function getJoinButtonText(room: any) {
    if (joining.value) return 'Joining...';
    if (room.roomState === RoomState.InProgress) return 'Game in Progress';
    if ((room.players?.length || 0) >= gameStore.MAX_PLAYERS) return 'Full';
    return 'Join Game';
}

async function handleJoinRoom(roomId: string) {
    try {
        const playerId = localStorage.getItem('playerId');
        if (!playerId) {
            throw new Error('Player ID not found');
        }

        joining.value = true;
        await gameStore.joinRoom(roomId, playerId);
        router.push(`/game/${roomId}`);
    } catch (error: any) {
        console.error('Failed to join room:', error);
        alert(error.message || 'Failed to join game room. Please try again.');
    } finally {
        joining.value = false;
    }
}
</script>

<style scoped>
.game-list {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

h2 {
    color: #61dafb;
    text-align: center;
    margin-bottom: 20px;
}

.rooms-container {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 20px;
}

.room-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid #61dafb;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.room-info {
    flex: 1;
}

.room-status {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9em;
    margin-bottom: 8px;
    text-transform: capitalize;
    font-weight: bold;
}

.room-status.waiting {
    background: #4CAF50;
}

.room-status.in_progress {
    background: #FFC107;
    color: #000;
}

.players {
    font-size: 0.9em;
}

.player-list {
    margin-top: 5px;
    padding-left: 10px;
    font-size: 0.8em;
    color: #ccc;
}

button {
    background: #61dafb;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    color: #282c34;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover:not(:disabled) {
    background: #21a1f1;
}

button:disabled {
    background: #cccccc;
    cursor: not-allowed;
    opacity: 0.7;
}

.joining {
    opacity: 0.7;
    cursor: wait;
}

.loading, .error, .no-rooms {
    text-align: center;
    padding: 20px;
    color: #ccc;
}

.error {
    color: #ff4444;
}
</style>
