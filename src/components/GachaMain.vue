<template>
  <div class="main">
    <h1>ガチャ</h1>
    <button @click="draw">がちゃを引く</button>
    <h4>現在{{ spent }}円</h4>
    <hr>
    <h1>{{ rarity }}</h1>
    <h2>{{ itemName }}</h2>
    <img :src="itemPath" class="result-item">
  </div>
</template>

<script setup lang="ts">
 import { ref, computed, onMounted } from 'vue';
 import { useStore } from 'vuex';
 import axios from 'axios';
 import { Gacha, key } from '../store/store.ts';
 import { GachaModel, GachaResult } from '../models/gacha.ts';

 const store = useStore(key);
 const rarity: string = ref("SSR");
 const itemName: string = ref("20170519_oota.png");

 const itemPath = computed((): string => {
   return `/gacha/img/${itemName.value}`;
 });

 const spent = computed((): number => {
   return store.state.count * 300;
 });

 const draw = (): void => {
   store.commit("increment");
   const model = new GachaModel(store.state.gacha);
   const result: GachaResult  = model.draw();
   rarity.value = result.rarity;
   itemName.value = result.name;
 };

 onMounted(() => {
   const getJson = async () => {
     let res;
     try {
       res = await axios.get('/gacha/gacha.json');
     } catch (err) {
       console.log(err);
       return;
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
 .result-item {
   max-width: 70%
 }
</style>
