<template>
  <div class="game-over">
    <h1>🎉 Game Over! 🎉</h1>
    <div class="winner-section" v-if="winner">
      <h2>Congratulations, {{ winner.name }}!</h2>
      <p>You are the winner with a score of {{ store.getPlayerScore(winner.id) }}!</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Player Name</th>
          <th>Score</th>
          <th>Number of Cards</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="player in sortedPlayers"
          :key="player.id"
          :class="{ 'winner-row': player.id === winner.id }"
        >
          <td>{{ player.name }}</td>
          <td>{{ store.getPlayerScore(player.id) }}</td>
          <td>{{ player.deck.length }}</td>
        </tr>
      </tbody>
    </table>
    <div class="button-container">
      <button @click="router.push('/setup')">Quit</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from "../stores/GameStore";
import { useRouter } from "vue-router";
import { computed } from "vue";

const store = useGameStore();
const router = useRouter();

const sortedPlayers = computed(() => {
  return store.players.slice().sort((a, b) => {
    const scoreA = store.getPlayerScore(a.id);
    const scoreB = store.getPlayerScore(b.id);
    return scoreB - scoreA; // Sort in descending order
  });
});

// Get the winner (player with the highest score)
const winner = computed(() => sortedPlayers.value[0]);

</script>

<style scoped>
.game-over {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
  justify-content: center; /* Center content vertically */
  width: 100%; /* Full width */
  max-width: 600px; /* Limit maximum width */
  margin: 20px auto; /* Center horizontally */
  background-color: rgba(0, 0, 0, 0.9); /* Dark background */
  border-radius: 8px;
  padding: 20px;
  color: white; /* Text color */
  text-align: center; /* Center text */
  animation: fadeIn 1s ease-in-out; /* Fade-in animation */
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.winner-section {
  margin-bottom: 30px;
}

.winner-section h2 {
  font-size: 2em;
  color: #FFD700; /* Gold color for the winner */
  text-shadow: 0 0 10px #FFD700;
}

.winner-section p {
  font-size: 1.2em;
}

table {
  width: 100%; /* Full width */
  border-collapse: collapse; /* Remove space between borders */
  margin-bottom: 20px;
}

th, td {
  padding: 10px; /* Padding inside table cells */
  border: 1px solid #61dafb; /* Border color */
  text-align: center; /* Center text */
}

th {
  background-color: #282c34; /* Header background */
  color: white; /* Header text color */
}

tr {
  background-color: rgba(255, 255, 255, 0.1);
}

.winner-row {
  background-color: rgba(255, 215, 0, 0.3); /* Highlight winner row */
}

tr:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

button {
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 5px;
  background-color: #61dafb;
  color: #282c34;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #21a1f1;
}
</style>
