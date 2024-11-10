<template>
  <div class="gameplay">
    <!-- Pause Button -->
    <div class="pause-button-container">
      <button class="pause-button" @click="navigateToBreakScreen">
        Pause
      </button>
    </div>

    <!-- Waiting Room -->
    <div v-if="!store.gameStarted" class="waiting-room">
      <h2>Waiting Room</h2>
      <p class="player-count">Players: {{ store.players.length }}/{{ store.MAX_PLAYERS }}</p>
      <button 
        v-if="isHost"
        @click="store.startGame()"
        :disabled="store.players.length < 2"
        class="start-button"
      >
        Start Game
      </button>
      <p v-if="store.players.length < 2" class="waiting-message">
        Waiting for more players to join...
      </p>
    </div>

    <!-- Player List Bar -->
    <div class="players-bar">
      <div 
        v-for="(player, index) in store.players" 
        :key="player.id"
        class="player-indicator"
        :class="{
          'current-turn': store.currentPlayerInTurn() === index + 1,
          'you': player.id === playerId
        }"
      >
        <div class="player-name">{{ player.name }}</div>
        <div class="cards-count">Cards: {{ player.hand?.length || 0 }}</div>
      </div>
    </div>

    

    <!-- Game UI -->
    <div v-if="store.gameStarted">
      <h1>UNO</h1>
      <p>Target score: {{ targetScore }}</p>
      
      <button
        v-if="store.players[store.currentPlayerInTurn() - 1]?.hand?.length === 1"
        @click="handleAccuse"
        :disabled="!isMyTurn"
      >
        Accuse
      </button>
      
      <div class="decks">
        <div class="card">
          <button
            @click="drawCard"
            :disabled="!isMyTurn || drawnThisTurn"
            :class="{ 
              inactive: !isMyTurn || drawnThisTurn,
              'not-your-turn': !isMyTurn 
            }"
          >
            Draw Card
          </button>
        </div>
        <div
          class="discard"
          :style="{
            backgroundColor:
              store.discardPileTopCard?.color?.toUpperCase() || '#ccc',
          }"
        >
          <span class="discard-text"
            >{{
              store.discardPileTopCard?.type === "NUMBERED"
                ? store.discardPileTopCard?.number
                : store.discardPileTopCard?.type
            }}
          </span>
        </div>
      </div>

      <PlayerHand
        :cards="store.players[playerIndex].hand"
        :isActive="isMyTurn"
      />

      <p v-if="winner">Player {{ winner + 1 }} wins the round!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayerHand from "../components/PlayerHand.vue";
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGameStore } from "../stores/GameStore";

const route = useRoute();
const store = useGameStore();
const playerId = localStorage.getItem('playerId');

// Check if current player is the host (first player)
const isHost = computed(() => {
    return store.players[0]?.id === playerId;
});

const targetScore = store.getTargetScore();

let currentPlayer = store.currentPlayerInTurn();
const winner = ref<number | undefined>(undefined);
const drawnThisTurn = ref(false);
const playerIndex = 0;

//<---- Card behaviour ---->

watch(
  () => store,
  (localStore) => {
    if (localStore.currentPlayerInTurn() !== currentPlayer) {
      drawnThisTurn.value = false;
    }
  }
);

// Add computed property for checking if it's player's turn
const isMyTurn = computed(() => {
  const currentPlayerIndex = store.currentPlayerInTurn() - 1; // Convert to 0-based index
  return store.players[currentPlayerIndex]?.id === playerId;
});

function handleAccuse() {
  if (!isMyTurn.value) return;
  
  store.catchUnoFailure({
    accuser: 0,
    accused: store.currentPlayerInTurn(),
  });
  store.updateAllPlayerDecks();
}

function drawCard() {
  if (!isMyTurn.value || drawnThisTurn.value) return;
  
  store.draw();
  drawnThisTurn.value = true;
}

const router = useRouter();

//<--- Navigation --->
const navigateToBreakScreen = () => {
  router.push({
    name: "Break",
  });
};

onMounted(() => {
    const roomId = route.params.roomId as string;
    store.subscribeToRoomUpdates(roomId);
});

onUnmounted(() => {
    store.unsubscribeFromRoom();
});
</script>

<style scoped lang="css">
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  scroll-snap-align: start;
}

.card:first-child {
  scroll-margin-left: 10px;
}

.decks {
  display: flex;
  justify-content: center;
  max-width: 100%;
  align-items: center;
}

.draw {
  background-color: #101010;
  color: #ffffff;
}

.colorselector {
  display: flex;
  align-items: center;
  justify-content: center;
}

.discard {
  width: 150px;
  height: 225px;
  color: #ffffff;
  background-color: #ffffff;
  border: 2px solid white;
  border-radius: 10px;
  text-align: center;
  align-items: center;
  font-size: 12px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  color: #1f1f1f;
  display: flex;
  justify-content: center;
}

.discard-text {
  color: white;
  font-size: 30px;
  text-shadow: 0 0 4px black;
}

button {
  width: 100px;
  height: 150px;
  background-color: #101010;
  border: 2px solid #000;
  border-radius: 10px;
  text-align: center;
  font-size: 12px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  color: whitesmoke;
}

button:hover {
  color: #101010;
  background-color: #f0f0f0;
}

.gameplay {
  text-align: center;
  /* background: #233142;
   */
}

.testBtn {
  display: none;
}

.inactive {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.waiting-room {
    padding: 20px;
    text-align: center;
}

.player-count {
    color: #61dafb;
    font-size: 1.1em;
    margin: 10px 0;
}

.start-button {
    width: auto;
    height: auto;
    padding: 12px 24px;
    margin: 20px 0;
    font-size: 16px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.start-button:hover:not(:disabled) {
    background: #45a049;
    transform: translateY(-2px);
}

.start-button:disabled {
    background: #cccccc;
    cursor: not-allowed;
    opacity: 0.7;
}

.waiting-message {
    color: #888;
    font-style: italic;
    margin-top: 10px;
}

.players-bar {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin: 10px;
  flex-wrap: wrap;
}

.player-indicator {
  padding: 12px 24px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  min-width: 150px;
  position: relative;
}

.player-indicator::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.player-indicator.current-turn {
  background: rgba(97, 218, 251, 0.3);
  border-color: #61dafb;
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(97, 218, 251, 0.3);
}

.player-indicator.current-turn::before {
  opacity: 1;
  animation: pulse 2s infinite;
  border: 2px solid #61dafb;
}

.player-indicator.you::after {
  content: '(YOU)';
  position: absolute;
  top: -10px;
  right: -10px;
  background: gold;
  color: black;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7em;
  font-weight: bold;
}

.player-name {
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;
  font-size: 1.1em;
}

.cards-count {
  font-size: 0.9em;
  color: #ccc;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  display: inline-block;
}

@keyframes pulse {
  0% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.02);
  }
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
}

.not-your-turn {
  background-color: #444 !important;
  border-color: #333 !important;
  cursor: not-allowed !important;
  opacity: 0.5;
}

.not-your-turn:hover {
  background-color: #444 !important;
  color: whitesmoke !important;
  transform: none !important;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Add a tooltip style for disabled buttons */
button[disabled]:hover::after {
  content: "Not your turn";
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

/* Add new pause button styles */
.pause-button-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

.pause-button {
  width: auto;
  height: auto;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.4);
  color: #61dafb;
  border: 2px solid #61dafb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 15px rgba(97, 218, 251, 0.1);
}

.pause-button:hover {
  background: rgba(97, 218, 251, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(97, 218, 251, 0.2);
  color: #61dafb;
}

.pause-button:active {
  transform: translateY(0);
  box-shadow: 0 0 10px rgba(97, 218, 251, 0.1);
}
</style>
