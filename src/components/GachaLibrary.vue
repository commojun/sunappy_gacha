<template>
  <v-container class="d-flex">
    <v-row>
      <v-col
        v-for="item in items"
        cols="3"
        :key="item.name"
      >
        <v-card color="#FFEBEE">
          <v-card-title>{{ item.rarity }}</v-card-title>
          <v-img height="100" :src="itemPath(item.name)"></v-img>
          <v-card-text>{{ item.name }}</v-card-text>
          <v-card-subtitle class="justify-end">所有: {{ item.amount }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
 import { ref } from 'vue';
 import { useStore } from 'vuex';
 import { key } from '../store/store';
 import { Gacha, RARITY } from '../models/gacha';
 import { UserItem } from '../models/library';

 const state = useStore(key).state;
 const gacha: Gacha = state.gacha;
 const userItem: UserItem = state.userItem;

 const itemPath = (name: string): string => {
   return `/gacha/img/${name}`;
 };

 let items: {
   name: string,
   rarity: RARITY,
   amount: number,
   lastUpdate: string,
 }[] = ref([]);
 for (const rarity of Object.keys(gacha.table)) {
   for (const name of gacha.table[rarity]){
     const amount = userItem[name] ? userItem[name].amount : 0;
     const lastUpdate = userItem[name] ? userItem[name].lastUpdate : "";
     items.value.push({
       name: name,
       rarity: rarity,
       amount: amount,
       lastUpdate: lastUpdate,
     });
   }
 }
</script>
