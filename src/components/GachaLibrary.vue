<template>
  <v-container class="d-flex">
    <v-row>
      <v-col
        v-for="item in items"
        :key="item.name"
        md="3"
        cols="6">
        <v-card color="#FFEBEE">
          <v-card-title>{{ item.rarity }}</v-card-title>
          <v-img height="150" :src="itemPath(item.name)"></v-img>
          <v-card-text>{{ item.name }}</v-card-text>
          <v-card-subtitle class="justify-end">所有: {{ havingAmount(item.name) }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
 import { computed, defineProps } from 'vue';
 import { useStore } from 'vuex';
 import { key } from '../store/store';
 import { LibraryModel, LibraryItem } from '../models/library';

 interface Props {
   libraryModel: LibraryModel;
 }
 const props = defineProps<Props>();
 const store = useStore(key);
 const userItems = store.state.userData.userItems;

 const itemPath = (name: string): string => {
   return `/gacha/img/${name}`;
 };
 const havingAmount = (name: string): number => {
   return userItems[name] ? userItems[name].amount : 0;
 };

 const items = computed((): LibraryItem[] => {
   return props.libraryModel.items.filter(item => userItems[item.name]);

 });
</script>
