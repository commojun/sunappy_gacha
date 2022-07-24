<template>
  <v-container class="text-center">
    <v-row justify="center">
      <v-col
        cols="12"
        md="6">
        <h1 class="text-h1 text-center">ガチャ</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12"
             md="6">
        <div
          class="elevation-3 rounded-lg my-2 px-2">
        <v-row justify="center">
          <v-col>
            <v-rating
              color="yellow"
              length="4"
              size="64"
              v-model="rarityStar"
            ></v-rating>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col class="fixed-height d-flex align-center justify-center">
            <img :src="itemPath" class="elevation-1 gacha-result" />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col>
            <strong>{{ rarity }}</strong>: {{ itemName }}
          </v-col>
        </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-btn
          height="70"
          width="100%"
          class="rounded-lg text-md-h5"
          color="primary"
          @click="draw">
          <v-icon start icon="mdi-cash"></v-icon>
          ガチャを引く ￥300
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="3">
        <v-btn
          height="70"
          width="100%"
          class="rounded-lg text-md-h5"
          size="x-large">
          提供割合
        </v-btn>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn
          height="70"
          width="100%"
          class="rounded-lg text-md-h5"
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
            <v-toolbar class="dialog-toolbar">
              <v-toolbar-title>図鑑</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
            </v-toolbar>
            <v-card-text>
              <GachaLibrary :libraryModel="libraryModel"></GachaLibrary>
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
 import { GachaModel, GachaResult } from '../models/gacha';
 import { LibraryModel } from '../models/library.ts';
 import GachaLibrary from './GachaLibrary.vue';

 let gachaModel: GachaModel;
 let libraryModel: LibraryModel = ref(null);
 const store = useStore(key);
 const rarity: string = ref("ガチャ結果がここに出ます");
 const rarityStar: number = ref(0);
 const itemName: string = ref("../.." + require("@/assets/gachagacha.png"));
 const dialog = ref(false);

 const itemPath = computed((): string => {
   return `/gacha/img/${itemName.value}`;
 });

 const draw = (): void => {
   const result: GachaResult = gachaModel.draw();
   libraryModel.value.updateUserData(result);

   // 表示の更新
   rarity.value = result.rarity;
   rarityStar.value = result.rarityNum;
   itemName.value = result.name;
 };

 onMounted(() => {
   initGacha();
   gachaModel = new GachaModel(store.state.gacha);
   libraryModel.value = new LibraryModel(store);
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
 .dialog-toolbar {
   overflow: visible;
 }
</style>
