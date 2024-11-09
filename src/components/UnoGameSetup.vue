<template>
  <div class="uno-game-setup">
    <div class="header">
      <h1>Uno Game Rooms</h1>
    </div>
    <div class="game-container">
      <div class="game-component">
        <button @click="createNewRoom" class="create-room-btn">
          <span class="btn-text">Create New Room</span>
        </button>
        <GameList :games="games" @select-game="joinGame"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import GameList from './GameList.vue';
import { useGameStore } from '../stores/GameStore';

const router = useRouter();
const gameStore = useGameStore();
const games = ref([]);

async function createNewRoom() {
  try {
    let playerId = localStorage.getItem('playerId');
    if (!playerId) {
      alert('Please log in first');
      router.push('/');
      return;
    }
    const roomId = await gameStore.createRoom();
    if (roomId) {
      await gameStore.joinRoom(roomId, playerId);
      router.push(`/play/${roomId}`);
    }
  } catch (error) {
    console.error('Failed to create room:', error);
  }
}

async function joinGame(roomId: string) {
  try {
    let playerId = localStorage.getItem('playerId');
    if (!playerId) {
      alert('Please log in first');
      router.push('/');
      return;
    }
    
    await gameStore.joinRoom(roomId, playerId);
    router.push(`/play/${roomId}`);
  } catch (error) {
    console.error('Failed to join room:', error);
  }
}
</script>

<style scoped>
h1 {
  font-size: 2.5rem;
  color: #61dafb;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.uno-game-setup {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.game-container {
  width: 100%;
  max-width: 800px;
}

.game-component {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.create-room-btn {
  width: 100%;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.create-room-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  background: linear-gradient(45deg, #45a049, #4CAF50);
}

.create-room-btn:active {
  transform: translateY(1px);
}

.btn-text {
  display: inline-block;
  transform: translateY(1px);
}
</style>