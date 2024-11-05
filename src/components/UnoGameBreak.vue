<template>
  <div class="game-review">
    <h1>Game Review</h1>
    <table>
      <thead>
        <tr>
          <th>Player Name</th>
          <th>Score</th>
          <th>Number of Cards</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in sortedPlayers" :key="player.id">
          <td>{{ player.name }}</td>
          <td>{{ store.getPlayerScore(player.id) }}</td>
          <td>{{ player.deck.length }}</td>
        </tr>
      </tbody>
    </table>
    <div class="button-container">
      <button @click="router.push('/game')">Back</button>
      <button @click="router.push('/setup')">Quit</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from "../stores/GameStore";
import { useRouter } from "vue-router";
import {computed} from "vue";

const store = useGameStore();
const router = useRouter();

const sortedPlayers = computed(() => {
  return store.players.slice().sort((a,b) =>{
    const scoreA = store.getPlayerScore(a.id);
    const scoreB = store.getPlayerScore(b.id);
    return scoreB - scoreA;
  });
});

</script>

<style scoped>
.game-review {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
  justify-content: center; /* Center content vertically */
  width: 100%; /* Full width */
  max-width: 600px; /* Limit maximum width */
  margin: 20px auto; /* Center horizontally with auto margin */
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
}

h1 {
  color: #61dafb; /* Title color to match existing styles */
  margin-bottom: 20px; /* Space below title */
}

table {
  width: 100%; /* Full width */
  border-collapse: collapse; /* Remove space between borders */
}

th, td {
  padding: 10px; /* Padding inside table cells */
  border: 1px solid #61dafb; /* Border color */
  text-align: left; /* Align text to the left */
}

th {
  background-color: #282c34; /* Header background */
  color: white; /* Header text color */
}

tr {
  background-color: rgba(255, 255, 255, 0.1); /* Slightly transparent cell background */
}

tr:hover {
  background-color: rgba(255, 255, 255, 0.2); /* Highlight on hover */
}

.button-container {
  display: flex;
  justify-content: space-between; /* Space buttons apart */
  width: 100%; /* Full width for buttons */
  margin-top: 20px; /* Space above buttons */
}

button {
  padding: 10px 20px; /* Button padding */
  border: none; /* No border */
  border-radius: 5px; /* Rounded corners */
  background-color: #61dafb; /* Button background color */
  color: #282c34; /* Button text color */
  cursor: pointer; /* Pointer cursor */
  transition: background-color 0.3s; /* Smooth transition */
  flex: 1; /* Allow buttons to take equal space */
  margin: 0 5px; /* Space between buttons */
}

button:hover {
  background-color: #21a1f1; /* Darker blue on hover */
}

button:disabled {
  background-color: #cccccc; /* Gray background for disabled button */
  cursor: not-allowed; /* Not allowed cursor */
}
</style>
