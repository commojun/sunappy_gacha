<template>
  <div class="main">
    <h1>{{ rarity }}</h1>
    <img :src="itemPath" class="result-item">
    <h2>{{ itemName }}</h2>
    <button @click="draw">がちゃを引く</button>
  </div>
</template>

<script setup lang="ts">
 import { ref, computed, onMounted } from 'vue';
 import { useStore } from 'vuex';
 import axios from 'axios';
 import { Gacha, key } from '../store/store.ts';

 const store = useStore(key);
 const rarity: string = ref("SSR");
 const itemName: string = ref("20170519_oota.png");

 const itemPath = computed((): string => {
   return `/gacha/img/${itemName.value}`;
 });

 const draw = (): void => {
   console.log("draw!!");
   rarity.value = "SR";
   itemName.value = "20170523_rakuten.png";
   console.log(store.state.gacha.table.ssr_items[3]);
 };

 onMounted(() => {
   const getJson = async () => {
     let res;
     try {
       res = await axios.get('/gacha/gacha.json');
     } catch (err) {
       console.log(err);
     }
     const gacha: Gacha = res.data;
     store.commit("initGacha", gacha);
   };
   getJson();
 });
</script>

<style scoped>
 div.main {
   text-align: center
 }
</style>
