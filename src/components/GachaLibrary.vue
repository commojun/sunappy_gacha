<template>
  <v-container class="d-flex">
    <v-row>
      <v-col
        v-for="item in items"
        :key="item.name"
        cols="3">
        <v-card color="#FFEBEE">
          <v-card-title>{{ item.rarity }}</v-card-title>
          <v-img height="150" :src="itemPath(item.name)"></v-img>
          <v-card-text>{{ item.name }}</v-card-text>
          <v-card-subtitle class="justify-end">所有: {{ item.amount }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
 import { computed, defineProps, onMounted } from 'vue';
 import { LibraryModel, LibraryItem } from '../models/library';

 interface Props {
   libraryModel: LibraryModel;
 }
 const props = defineProps<Props>();

 const itemPath = (name: string): string => {
   return `/gacha/img/${name}`;
 };

 const items = computed((): LibraryItem[] => {
   return props.libraryModel.items.filter(item => item.amount > 0);
 });

 onMounted(() => {
 });
</script>
