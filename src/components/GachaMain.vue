<template>
  <div class="main">
    <h1>ガチャ</h1>
    <button @click="draw">がちゃを引く</button>
    <h4>現在{{ spent }}円</h4>
    <h4>
      <span v-for="r of rarities" :key="r">
        {{ r }}: {{ store.state.rarityCount[r] }}個
      </span>
    </h4>
    <hr>
    <h1>{{ rarity }}</h1>
    <h2>{{ itemName }}</h2>
    <img :src="itemPath" class="result-item">
  </div>
</template>

<script setup lang="ts">
 import { ref, computed, onMounted } from 'vue';
 import { useStore } from 'vuex';
 import { key, initGacha } from '../store/store';
 import { RARITY, GachaModel, GachaResult } from '../models/gacha';

 const store = useStore(key);
 const rarities = Object.values(RARITY);
 const rarity: string = ref("ガチャ結果がここに出ます");
 const itemName: string = ref("../.." + require("@/assets/gachagacha.png"));

 const itemPath = computed((): string => {
   return `/gacha/img/${itemName.value}`;
 });

 const spent = computed((): number => {
   return store.state.count * 300;
 });

 const draw = (): void => {
   const model = new GachaModel(store.state.gacha);
   const result: GachaResult  = model.draw();
   store.commit("increment", result.rarity);
   rarity.value = result.rarity;
   itemName.value = result.name;
 };

 onMounted(() => {
   initGacha();
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
