<template>
  <div class="uno-game-setup">
    <div class="user-info">
      <span v-if="username" class="username">
        {{ username }}
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </span>
      <span v-else class="not-logged">
        Not logged in
      </span>
    </div>
    <div class="header">
      <h1>Uno Game Rooms</h1>
    </div>
    <div class="game-container">
      <div class="game-component">
        <button @click="createNewRoom" class="create-room-btn" :disabled="!username">
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
const username = ref(localStorage.getItem('username'));

function handleLogout() {
  localStorage.removeItem('username');
  localStorage.removeItem('playerId');
  router.push('/');
}

async function createNewRoom() {
  try {
    const playerId = localStorage.getItem('playerId');
    if (!playerId) {
      alert('Please log in first');
      router.push('/');
      return;
    }
    const roomId = await gameStore.createRoom(playerId);
    router.push(`/game/${roomId}`);
  } catch (error) {
    console.error('Failed to create room:', error);
    alert('Failed to create room. Please try again.');
  }
}

async function joinGame(roomId: string) {
  try {
    const playerId = localStorage.getItem('playerId');
    if (!playerId) {
      alert('Please log in first');
      router.push('/');
      return;
    }
    
    await gameStore.joinRoom(roomId, playerId);
    router.push(`/game/${roomId}`);
  } catch (error) {
    console.error('Failed to join room:', error);
    alert('Failed to join room. Please try again.');
  }
}
</script>

<style scoped>
h1 {
  font-size: 2.8rem;
  margin-bottom: 2.5rem;
  background: linear-gradient(45deg, #61dafb, #21a1f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
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
  max-width: 900px;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
}

.game-component {
  width: 100%;
  height: calc(100vh - 250px);
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.create-room-btn {
  flex-shrink: 0;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  padding: 1.2rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  font-size: 1.3rem;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.create-room-btn:disabled {
  background: linear-gradient(45deg, #666, #555);
  cursor: not-allowed;
  opacity: 0.7;
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

.user-info {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 10;
}

.username {
  color: #61dafb;
  font-weight: 500;
}

.not-logged {
  color: #ff4444;
}

.logout-btn {
  margin-left: 10px;
  padding: 4px 8px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background: #ff2222;
}

/* Make sure the header has relative positioning to not conflict with absolute user-info */
.header {
  position: relative;
  width: 100%;
  text-align: center;
  margin-top: 3rem;
}
</style>