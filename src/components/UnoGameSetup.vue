<template>
  <div class="uno-game-setup">
    <div>
      <h1>Games</h1>
    </div>
    <div class="game-setup">
      <div class="game-component">
        <NewGame @create-game="addGame"/>
      </div>
      <div class="game-component">
        <GameList :games="games" @select-game="selectGame"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NewGame from './NewGame.vue';
import GameList from './GameList.vue';

const games = ref([
    { id: 1, hostname: 'Game1', playerCount: 3, status: 'Active' },
    { id: 2, hostname: 'Game2', playerCount: 2, status: 'Inactive' },
    { id: 3, hostname: 'Game3', playerCount: 5, status: 'Active' },
    // Add more game objects as needed
]);

const selectedGameId = ref(null);

function selectGame(gameId){
  selectedGameId.value = gameId;
}

function addGame(newGame){
  games.value.push(newGame);
}

</script>

<style>
.h1 {
  font-size: 40px;
}

.uno-game-setup {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.game-setup {
  display: flex;
  flex-direction: row;
  max-width: 800px;
  width: 100%; /* Change to 100% for responsive design */
  justify-content: space-between; /* Space out the child components */
}

.game-component {
  width: 400px; /* Fixed width for both components */
  max-height: 100vh; /* Fixed height for both components */
  margin: 10px; /* Margin between components */
  overflow-y: auto;
}

</style>