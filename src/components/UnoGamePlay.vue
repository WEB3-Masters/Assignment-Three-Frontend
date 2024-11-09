<template>
  <div class="gameplay">
    <!-- Waiting Room -->
    <div v-if="!store.gameStarted" class="waiting-room">
      <h2>Waiting Room</h2>
      <div class="players-list">
        <h3>Players ({{ store.players.length }}/{{ store.MAX_PLAYERS }})</h3>
        <ul>
          <li v-for="player in store.players" :key="player.id">
            {{ player.name }}
          </li>
        </ul>
      </div>
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

    <!-- Game UI -->
    <div v-else>
      <h1>UNO</h1>
      <p>Target score: {{ targetScore }}</p>
      <p>
        Current player:
        {{ store.currentPlayerInTurn() }}
      </p>
      <button
        v-if="store.players[store.currentPlayerInTurn() - 1]?.hand?.length === 1"
        @click="
          () => {
            // Assuming the accuser (you) is of index 0
            store.catchUnoFailure({
              accuser: 0,
              accused: store.currentPlayerInTurn(),
            });
            store.updateAllPlayerDecks();
          }
        "
      >
        Accuse
      </button>
      <p class="message">
        Discard Pile: {{ store.discardPileTopCard?.type }}
        {{ store.discardPileTopCard?.color }}
        {{ store.discardPileTopCard?.number }}
      </p>

      <div class="decks">
        <div class="card">
          <button
            @click="
              {
                drawCard();
              }
            "
            :disabled="drawnThisTurn"
            :class="{ inactive: drawnThisTurn }"
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
        :isActive="store.isPlayerInTurn(playerIndex)"
      />

      <p v-if="winner">Player {{ winner + 1 }} wins the round!</p>

      <button class="testBtn" @click="navigateToBreakScreen()">Break</button>
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

const numPlayers = Number(route.query.numPlayers);
const targetScore = store.getTargetScore();
const players = Array.from({ length: numPlayers }, (_, i) => `Player ${i + 1}`);

const currentPlayer = store.currentPlayerInTurn();
const winner = ref<number | undefined>(undefined);
const drawnThisTurn = ref(false);
const playerIndex = 0;

//<---- Card behaviour ---->
const cardsContainer = ref<HTMLDivElement | null>(null);

watch(
  () => store.currentPlayerInTurn(),
  (newPlayer) => {
    if (newPlayer !== currentPlayer) {
      drawnThisTurn.value = false;
    }
  }
);

function drawCard() {
  if (!drawnThisTurn.value) {
    store.draw();
    drawnThisTurn.value = true;
  }
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
  width: 50px;
  height: 30px;
  background-color: red;
  border: 2px solid black;
  border-radius: 10px;
  text-align: center;
}

.testBtn:hover {
  background-color: rgb(249, 171, 171);
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

.players-list {
    margin: 20px auto;
    max-width: 300px;
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 8px;
}

.players-list ul {
    list-style: none;
    padding: 0;
}

.players-list li {
    padding: 8px;
    margin: 4px 0;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

.start-button {
    width: auto;
    height: auto;
    padding: 12px 24px;
    margin: 20px 0;
    font-size: 16px;
}

.waiting-message {
    color: #888;
    font-style: italic;
}
</style>
