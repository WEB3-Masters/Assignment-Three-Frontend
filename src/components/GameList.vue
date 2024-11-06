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
                        <span class="room-status" :class="room.roomState.toLowerCase()">
                            {{ room.roomState }}
                        </span>
                        <div class="players">
                            <span>Players: {{ room.players?.length || 0 }}</span>
                            <div class="player-list">
                                <div v-for="player in room.players" :key="player.id">
                                    {{ player.username }}
                                    {{ player.id === room.currentPlayer?.id ? '(current)' : '' }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button 
                        @click="joinRoom(room.id)"
                        :disabled="room.roomState === 'IN_PROGRESS'"
                    >
                        Join Game
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
import { computed } from 'vue';
import { useGetRoomsQuery } from '../generated/graphql';
import { useRouter } from 'vue-router';

const router = useRouter();
const { result, loading, error } = useGetRoomsQuery();

const rooms = computed(() => result.value?.rooms || []);

function joinRoom(roomId: string) {
    // TODO: Implement join room mutation
    router.push(`/game/${roomId}`);
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
}

.room-status.waiting {
    background: #4CAF50;
}

.room-status.in_progress {
    background: #FFC107;
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
