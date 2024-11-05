<template>
    <button
      class="card"
      :class="[colorClass, { inactive: !isActive, playable: isPlayable }]"
      @click="handlePlay"
      :disabled="!isActive"
    >
      <div class="card-content">
        <span class="card-type">{{ displayText }}</span>
      </div>
    </button>
  </template>
  
  <script setup lang="ts">
  import { computed, defineProps, defineEmits } from 'vue';
  import type { CardType, CardColor } from "../model/deck";
import ColorSelector from './ColorSelector.vue';
  
  const props = defineProps({
    type: String,
    color: String,
    number: Number,
    isActive: Boolean,
    isPlayable: Boolean,
  });
  
  const emit = defineEmits(['play']);
  
  const colorClass = computed(() => props.color?.toLowerCase() || 'wild');
  
  const displayText = computed(() => {
    return props.type === 'NUMBERED' ? props.number : props.type;
  });
  
  const handlePlay = () => {
    if (props.isPlayable) {
      emit('play');
    }
  };
  </script>
  
  
  <style scoped>
  .card {
    width: 100px;
    height: 150px;
    border: 2px solid white;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
    font-size: 20px;
    color: white;
    text-shadow: 0 0 4px black;
    cursor: pointer;
    background-color: transparent;
    transition: transform 0.2s;
  }
  
  .card.playable {
    border-color: rgb(2, 200, 255);
  }

  .card.inactive {
    opacity: 0.5;
    pointer-events: none;
    cursor: default;
  }
  
  .card.red {
    background-color: red;
  }
  .card.green {
    background-color: green;
  }
  .card.blue {
    background-color: blue;
  }
  .card.yellow {
    background-color: yellow;
  }

  .card.wild {
    background: conic-gradient(
        red 25%, 
        green 25% 50%, 
        blue 50% 75%, 
        yellow 75%);
  }
  
  .card:hover {
    transform: scale(1.05);
  }
  </style>
  