<template>
  <GachaMain />
</template>

<script setup lang="ts">
 import { onMounted } from 'vue';
 import GachaMain from './components/GachaMain.vue';

 onMounted(() => {
   console.log("this is app");
 });
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
