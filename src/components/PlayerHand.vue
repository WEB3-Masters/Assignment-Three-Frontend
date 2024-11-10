<template>
  <div class="colorselector">    
  <ColorSelector v-if="showColorSelector" @colorSelected="completePlayWithColor"/>
  </div>
  <div class="playerhand" ref="cardsContainer" >
  <div>
    <h2>Your hand</h2>
    <div class="cards">
      <Card
        v-for="(card, index) in store.players[playerIndex].hand"
        :key="index"
        :type="card.type"
        :color="card.color"
        :number="card.number"
        :isActive="props.isActive"
        :isPlayable="isPlayable(index)"
        @play="play(index, card.type)"
      />
    </div>

    <button @click="() => store.sayUno(playerIndex)" v-if="props.cards.length === 1">
      Say Uno!
    </button>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Card from './Card.vue';
import { useGameStore } from "../stores/GameStore";
import type { CardType, CardColor } from "../model/deck";
import ColorSelector from "./ColorSelector.vue";

const store = useGameStore();
const props = defineProps<{
  cards: Array<{ type: CardType; color?: CardColor; number?: number }>;
  isActive: boolean;
}>();

const playerIndex = 0;
const showColorSelector = ref(false);
const selectedCardIndex = ref<number | null>(null);

function completePlayWithColor(chosenColor: CardColor) {
  if (selectedCardIndex.value !== null) {
    store.play(selectedCardIndex.value, chosenColor);
    selectedCardIndex.value = null;
  }
  showColorSelector.value = false;
}

function play(index: number, cardType: CardType) {
  if (cardType === "WILD" || cardType === "WILD DRAW") {
    showColorSelector.value = true;
    selectedCardIndex.value = index;
  } else {
    store.play(index);
  }
}

function isPlayable(index: number): boolean {
  return props.isActive && !!store.canPlay(index);
}
</script>

<style scoped lang="css">
.playerhand {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
}

.colorselector {
  max-width: 100%;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cards {
  display: flex;
  overflow-x: auto;
  height: 200px;
  max-width: 100%;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  justify-content: flex-start;
  padding: 20px;
  gap: 10px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.cards::-webkit-scrollbar {
  height: 8px;
}

.cards::-webkit-scrollbar-track {
  background: transparent;
}

.cards::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.cards::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>