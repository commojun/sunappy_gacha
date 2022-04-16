<template>
  <div class="main">
    <h1>{{ rarity }}</h1>
    <img :src="resultItemPath" class="result-item">
    <h2>{{ resultItemName }}</h2>
    <button>がちゃを引く</button>
  </div>
</template>

<script setup lang="ts">
 import { defineProps, computed } from 'vue';
 const props = defineProps<{
     rarity: string;
     resultItemName: string;
 }>();
 const resultItemPath = computed(() => `/gacha/img/${props.resultItemName}`);
</script>

<style scoped>
 div.main {
   text-align: center
 }
</style>
