<template>
  <div class="new-game-container">
    <button @click="createRoom" class="create-button">Create New Room</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/GameStore';

const router = useRouter();
const gameStore = useGameStore();

const createRoom = async () => {
  try {
    const roomId = await gameStore.createRoom();
    router.push(`/game/${roomId}`);
  } catch (error) {
    console.error('Failed to create room:', error);
  }
};
</script>

<style scoped>
.new-game-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.create-button {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: #45a049;
}
</style>
  