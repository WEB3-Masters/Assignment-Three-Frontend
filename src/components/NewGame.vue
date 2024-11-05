<template>
    <div class="new-game">
    <h2>New Game</h2>
    <div>
      <label>
        Number of players (Bots)
        <input type="number" min="1" max="3" v-model="botsCount" />
      </label>
    </div>
  
    <ul>
      <li v-for="(_, index) in new Array(botsCount)" :key="index">
        <div>
          <p>Bot({{ index + 1 }})</p>
          <select v-model="difficulty[index]">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </li>
    </ul>
  
    <button @click="createGame">Play</button>
  </div>
</template>
  
<script setup lang="ts">
  import { ref,defineEmits } from "vue";
  import { useGameStore } from "../stores/GameStore";
  import { useRouter } from "vue-router";

  const store = useGameStore();
  const router = useRouter();
  const emit = defineEmits(['create-game']);

  const botsCount = ref(1);
  const difficulty = ref<("easy" | "medium" | "hard")[]>([
    "medium",
    "medium",
    "medium",
  ]);

  
  function createGame() {
    const newGame = {
        id:Math.floor(Math.random()*1000),
        hostname:'Game',
        playerCount: botsCount.value,
        status:'Waiting'
    };

    store.createGame(difficulty.value.slice(0, botsCount.value));
    emit('create-game',newGame);
    router.push("/game");
  }
</script>
  
<style scoped>
.new-game {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 20px;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
}

h2 {
    color: #61dafb; /* Title color to match the existing styles */
}

label {
    color: white; /* Label color */
}

input[type="number"], select {
    padding: 10px; /* Input padding */
    margin-top: 5px; /* Space above input */
    border-radius: 5px; /* Rounded corners */
    border: 1px solid #61dafb; /* Border color */
    background-color: rgba(255, 255, 255, 0.71); /* Transparent background */
    color: white; /* Text color */
}

button {
    margin: 10px;
    padding: 10px 20px; /* Button padding */
    border: none; /* No border */
    border-radius: 5px; /* Rounded corners */
    background-color: #61dafb; /* Button background color */
    color: #282c34; /* Button text color */
    cursor: pointer; /* Pointer cursor */
    transition: background-color 0.3s; /* Smooth transition */
}

button:hover {
    background-color: #21a1f1; /* Darker blue on hover */
}

option {
    color: #282c34;
    background-color: rgba(255, 255, 255, 0.75);
}

  
  </style>
  