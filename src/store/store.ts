import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import { Gacha, GachaResult, RARITY } from '../models/gacha';
import { UserData } from '../models/library';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

export type State = {
  gacha: Gacha,
  userData: UserData,
};

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    gacha: {
      emission_rate: {
        [RARITY.SSR]: 0,
        [RARITY.SR]: 0,
        [RARITY.R]: 0,
        [RARITY.N]: 0,
      },
      table: {
        [RARITY.SSR]: [],
        [RARITY.SR]: [],
        [RARITY.R]: [],
        [RARITY.N]: [],
      },
    },
    userData: {
      count: 0,
      rarityCount: {
        [RARITY.SSR]: 0,
        [RARITY.SR]: 0,
        [RARITY.R]: 0,
        [RARITY.N]: 0,
      },
      drawHistory: [],
      userItem: {},
    },
  },
  mutations: {
    initGacha: (state: State, json: Gacha) => {
      state.gacha = json;
    },
    increment: (state: State, rarity: RARITY) => {
      state.userData.count++;
      state.userData.rarityCount[rarity]++;
    },
    addToHistory: (state: State, result: GachaResult) => {
      state.userData.drawHistory.push({
        rarity: result.rarity,
        name: result.name,
      });
    },
    newGachaItem: (state: State, result: GachaResult) => {
      state.userData.userItem[result.name] = {
        amount: 1,
        lastUpdate: new Date(),
      };
    },
    updateGachaItem: (state: State, result: GachaResult) => {
      state.userData.userItem[result.name].amount++;
      state.userData.userItem[result.name].lastUpdate = new Date();
    },
  },
  plugins: [
    createPersistedState(),
  ],
});

// onMountedで呼ぶ想定
export const initGacha = async () => {
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
