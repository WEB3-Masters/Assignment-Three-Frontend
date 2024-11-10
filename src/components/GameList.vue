<template>
    <div class="game-list">
        <h2>Available Games</h2>
        <div class="rooms-container-wrapper">
            <div class="rooms-container">
                <div v-if="loading" class="loading">
                    Loading rooms...
                </div>
                <div v-else-if="error" class="error">
                    {{ error.message }}
                </div>
                <div v-else class="rooms">
                    <div v-for="room in sortedRooms" :key="room.id" class="room-card">
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

const sortedRooms = computed(() => {
    return [...rooms.value].sort((a, b) => {
        // Sort by state: WAITING rooms first, then IN_PROGRESS
        if (a.roomState === RoomState.Waiting && b.roomState !== RoomState.Waiting) return -1;
        if (a.roomState !== RoomState.Waiting && b.roomState === RoomState.Waiting) return 1;
        
        // Then sort by number of players (more players first)
        return (b.players?.length || 0) - (a.players?.length || 0);
    });
});

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
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

h2 {
    color: #61dafb;
    text-align: center;
    margin-bottom: 20px;
    flex-shrink: 0;
}

.rooms-container-wrapper {
    flex: 1;
    min-height: 0;
    position: relative;
}

.rooms-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.rooms-container::-webkit-scrollbar {
    width: 8px;
}

.rooms-container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

.rooms-container::-webkit-scrollbar-thumb {
    background: rgba(97, 218, 251, 0.5);
    border-radius: 4px;
}

.rooms-container::-webkit-scrollbar-thumb:hover {
    background: rgba(97, 218, 251, 0.7);
}

.room-card {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(97, 218, 251, 0.3);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
}

.room-card:hover {
    transform: translateY(-2px);
    border-color: #61dafb;
    box-shadow: 0 4px 12px rgba(97, 218, 251, 0.2);
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
    background: rgba(76, 175, 80, 0.9);
    color: white;
}

.room-status.in_progress {
    background: rgba(255, 193, 7, 0.9);
    color: black;
}

.players {
    font-size: 0.9em;
}

.player-list {
    margin-top: 8px;
    padding-left: 15px;
    font-size: 0.9em;
    color: #e0e0e0;
}

button {
    background: linear-gradient(45deg, #61dafb, #21a1f1);
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

button:hover:not(:disabled) {
    background: linear-gradient(45deg, #21a1f1, #61dafb);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(97, 218, 251, 0.3);
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
