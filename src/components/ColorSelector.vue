<template>
    <div class="color-selector">
      <div class="color red" @click="selectColor('RED')"></div>
      <div class="color green" @click="selectColor('GREEN')"></div>
      <div class="color blue" @click="selectColor('BLUE')"></div>
      <div class="color yellow" @click="selectColor('YELLOW')"></div>
    </div>
  </template>
  
  <script setup>
  import { defineEmits } from 'vue';
  
  const emit = defineEmits(['colorSelected']);

  function selectColor(color) {
    emit('colorSelected', color);
  }

  </script>
  
  <style scoped>
  .color-selector {
    margin: 10px;
    width: 150px;
    height: 150px;
    position: relative;
    border-radius: 50%;
    border: 2px solid black;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
  
  .color {
    width: 100%;
    height: 100%;
  }

  .color:hover {
    transform: scale(1.1);
    z-index: 1;
    border: 2px solid aqua;
  }

  .red { background-color: red; }
  .green { background-color: green; }
  .blue { background-color: blue; }
  .yellow { background-color: yellow; }
  </style>
  