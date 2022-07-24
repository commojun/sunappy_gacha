<template>
  <v-row>
    <v-col cols="12">
      <v-card color="#BBDEFB">
        <v-card-title>コンプリート状況</v-card-title>
        <v-card-text>
          <v-row
            v-for="rarity in RARITY"
            :key="rarity">
            <v-col
              cols="5"
              md="2"
              class="flex-shrink-0 flex-grow-1">
              <strong>{{ rarity }}</strong>: {{ raritySum(rarity) }}/{{ rarityTotal(rarity) }}
            </v-col>
            <v-col
              cols="7"
              md="10"
              class="d-flex flex-grow-1 align-center">
              <v-progress-linear
                :model-value="rarityProgress(rarity)"
                color="#FF4081"
                height="15"></v-progress-linear>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-title>プレイデータ</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <strong>つぎ込んだお金</strong>:
              {{ spent }}円
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span
                v-for="rarity of RARITY"
                :key="rarity">
                <strong>{{ rarity }}</strong>:{{ store.state.userData.rarityCount[rarity] }}個
              </span>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col
      v-for="item in items"
      :key="item.name"
      md="3"
      cols="6">
      <v-card
        color="#FFEBEE"
        hover
        elevation="1">
        <v-card-title>{{ item.rarity }}</v-card-title>
        <v-img
          height="150"
          :src="itemPath(item.name)"
          @click="showOverlay(item.name)"
        ></v-img>
        <v-card-text>{{ item.name }}</v-card-text>
        <v-card-subtitle class="justify-end">所有: {{ havingAmount(item.name) }}</v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
  <v-overlay
    v-model="overlay"
    class="d-flex justify-center align-center"
    max-height="95%"
    max-width="95%">
    <img
      class="overlay-img"
      :src="overlaySrc">
  </v-overlay>
</template>

<script setup lang="ts">
 import { ref, computed, defineProps } from 'vue';
 import { useStore } from 'vuex';
 import { key } from '../store/store';
 import { RARITY } from '../models/gacha.ts';
 import { LibraryModel, LibraryItem } from '../models/library';

 interface Props {
   libraryModel: LibraryModel;
 }
 const props = defineProps<Props>();
 const store = useStore(key);
 const userItems = store.state.userData.userItems;
 const overlay = ref(false);
 const overlaySrc = ref("");

 const itemPath = (name: string): string => {
   return `/gacha/img/${name}`;
 };
 const havingAmount = (name: string): number => {
   return userItems[name] ? userItems[name].amount : 0;
 };
 const raritySum = (rarity: RARITY): number => {
   const itemsByRarity = items.value.filter(item => item.rarity == rarity);
   return itemsByRarity.length;
 };
 const rarityTotal = (rarity: RARITY): number => {
   return store.state.gacha.table[rarity].length;
 };
 const rarityProgress = (rarity: RARITY): number => {
   return Math.floor(100 * raritySum(rarity) / rarityTotal(rarity));
 };
 const showOverlay = (name: string): void => {
   overlaySrc.value = itemPath(name);
   overlay.value = true;
 };

 const spent = computed((): number => {
   return store.state.userData.count * 300;
 });
 const items = computed((): LibraryItem[] => {
   return props.libraryModel.items.filter(item => userItems[item.name]);
 });

</script>

<style scoped>
 .overlay-img {
   height: 100%;
   width: 100%;
 }
</style>
