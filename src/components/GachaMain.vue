<template>
  <h1 class="text-h1 text-center">ガチャ</h1>
  <h4>現在{{ spent }}円</h4>
  <h4>
    <span v-for="r of rarities" :key="r">
      {{ r }}: {{ store.state.rarityCount[r] }}個
    </span>
  </h4>
  <h1 class="text-center">{{ rarity }}</h1>
  <h1 class="text-center">
    <v-rating
      color="yellow"
      length="4"
      size="64"
      :model-value="3"
    ></v-rating>
  </h1>
  <h2 class="text-center">{{ itemName }}</h2>
  <v-container class="text-center">
    <v-row class="fixed-height" justify="center">
      <v-col cols="6" class="fixed-height d-flex align-center justify-center">
        <img :src="itemPath" class="elevation-3 gacha-result" />
      </v-col>
    </v-row>
  </v-container>
  <v-container class="text-center">
    <v-row justify="center">
      <v-col cols="12">
        <v-btn
          height="100"
          class="rounded-pill text-h4"
          color="primary"
          @click="draw">
          <v-icon start icon="mdi-cash"></v-icon>
          ガチャを引く ￥300
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn
          height="100"
          min-width="100%"
          class="rounded-pill text-h5"
          size="x-large">
          提供割合（予定）
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn
          height="100"
          width="100%"
          class="rounded-pill text-h5"
          size="x-large"
          @click="dialog = true">
          図鑑
        </v-btn>
        <v-dialog
          v-model="dialog"
          fullscreen
          scrollable
          transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar>
              <v-toolbar-title>ザ図鑑</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
            </v-toolbar>
            <v-card-text>
              <GachaLibrary></GachaLibrary>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
 import { ref, computed, onMounted } from 'vue';
 import { useStore } from 'vuex';
 import { key, initGacha } from '../store/store';
 import { RARITY, GachaModel, GachaResult } from '../models/gacha';
 import GachaLibrary from './GachaLibrary.vue';

 var model: GachaModel;
 const store = useStore(key);
 const rarities = Object.values(RARITY);
 const rarity: string = ref("ガチャ結果がここに出ます");
 const itemName: string = ref("../.." + require("@/assets/gachagacha.png"));
 const dialog = ref(false);

 const itemPath = computed((): string => {
   return `/gacha/img/${itemName.value}`;
 });

 const spent = computed((): number => {
   return store.state.count * 300;
 });

 const draw = (): void => {
   const result: GachaResult = model.draw();
   rarity.value = result.rarity;
   itemName.value = result.name;
 };

 onMounted(() => {
   initGacha();
   model = new GachaModel(store);
 });
</script>

<style scoped>
 .fixed-height {
   height: 500px;
 }
 .gacha-result {
   max-width: 100%;
   max-height: 100%;
 }
</style>
