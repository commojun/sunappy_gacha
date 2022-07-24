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
          class="elevation-3 rounded-lg my-2 px-2"
          :class="`bg-${itemColor}-lighten-3 ${resultCardAnimation}`">
        <v-row justify="center">
          <v-col>
            <v-rating
              class="gacha-rating"
              color="yellow"
              length="4"
              size="64"
              readonly
              v-model="rarityStar"
            ></v-rating>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col
            class="d-flex align-center justify-center"
            :style="{height: gachaHeight+'px'}">
            <img
              :src="itemPath"
              class="elevation-1 gacha-result"
              :class="resultImgAnimation" />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col :class="initialState ? 'transparent' : ''">
            <v-chip
              label
              v-show="isNew"
              :class="isNewAnimation"
              class="font-weight-bold bg-white text-red mr-2">
              New!!
            </v-chip>
            <v-chip
              :class="`bg-${itemColor}-darken-4`"
              label
              variant="outlined"
              class="font-weight-bold">
              {{ rarity }}
            </v-chip>
            {{ itemName }}
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
          color="amber"
          :disabled="drawLock"
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
          size="x-large"
          @click="soon = true">
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
        <v-dialog v-model="soon">
          <v-card>
            <v-card-text>そのうち作ります</v-card-text>
            <v-card-actions>
              <v-btn
                color="primary"
                block
                @click="soon = false">OK</v-btn>
            </v-card-actions>
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
 import { GachaModel, GachaResult, ColorByRarity } from '../models/gacha';
 import { LibraryModel } from '../models/library.ts';
 import GachaLibrary from './GachaLibrary.vue';

 let gachaModel: GachaModel;
 let libraryModel: LibraryModel = ref(null);
 const store = useStore(key);
 // reactive states
 const initialState: boolean = ref(true);
 const rarity: string = ref("-");
 const rarityStar: number = ref(0);
 const itemName: string = ref("../.." + require("@/assets/gachagacha.png"));
 const dialog: boolean = ref(false);
 const soon: boolean = ref(false);
 const resultCardAnimation: string = ref("");
 const resultImgAnimation: string = ref("");
 const isNewAnimation: string = ref("");
 const drawLock: boolean = ref(false);
 const isNew: boolean = ref(false);

 const gachaHeight: number = window.innerWidth < 500 ? window.innerWidth : 500;

 const itemPath = computed((): string => {
   return `/gacha/img/${itemName.value}`;
 });
 const itemColor = computed((): string => {
   return ColorByRarity[rarity.value] ? ColorByRarity[rarity.value] : "white";
 });

 const draw = (): void => {
   // ロックがかかっていると引けない
   if (drawLock.value) {
     return;
   }
   initialState.value = false;
   drawLock.value = true;

   // 引く前に表示をすべて消す
   resultCardAnimation.value = "transparent";
   resultImgAnimation.value = "transparent";
   isNewAnimation.value = "transparent";

   // 引く
   const result: GachaResult = gachaModel.draw();
   isNew.value = libraryModel.value.updateUserData(result);

   // 表示の更新
   rarity.value = result.rarity;
   rarityStar.value = result.rarityNum;
   itemName.value = result.name;
   // アニメーション (ダブった場合はサクサク表示する)
   const cardDelay = isNew.value ? 500 : 100;
   setTimeout(() => {
     resultCardAnimation.value = "fade-in";
   }, cardDelay);
   const imgDelay = cardDelay + (isNew.value ? 500 : 0);
   setTimeout(() => {
     resultImgAnimation.value = "popup";
   }, imgDelay);
   if (isNew.value) {
     const newDelay = imgDelay + 400;
     setTimeout(() => {
       isNewAnimation.value = "popup";
     }, newDelay);
   }
   const lockDelay = imgDelay + (isNew.value ? 500 : 0);
   setTimeout(() => {
     drawLock.value = false;
   }, lockDelay);
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

 .transparent {
   opacity: 0%;
 }
 .fade-in {
   animation-name: fade-in-animation;
   animation-fill-mode: forwards;
   animation-duration: 0.5s;
 }
 .popup {
   animation-name: popup-animation;
   animation-fill-mode: forwards;
   animation-duration: 0.3s;
 }

 @keyframes fade-in-animation {
   from {
     opacity: 0%;
   }
   to {
     opacity: 100%;
   }
 }
 @keyframes popup-animation {
   0% {
     transform: scale(0.8);
   }
   50% {
     transform: scale(1.05);
   }
   100% {
     transform: scale(1);
   }
 }
</style>
