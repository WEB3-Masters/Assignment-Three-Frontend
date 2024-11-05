<template>
  <div class="colorselector">    
  <ColorSelector v-if="showColorSelector" @colorSelected="completePlayWithColor"/>
  </div>
  <div class="playerhand" ref="cardsContainer" >
  <div>
    <h2>Your hand</h2>
    <div class="cards">
      <Card
        v-for="(card, index) in store.players[playerIndex].deck"
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
  cards: Array<{ type: CardType; color: CardColor; number?: number }>;
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
  return props.isActive && store.canPlay(index);
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
  max-width: 100%;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  justify-content: start;
  padding: 5px;
  gap: 5px;
}
</style>