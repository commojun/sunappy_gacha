import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import { Gacha, RARITY } from '../models/gacha';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

export type State = {
  gacha: Gacha,
  count: number,
  rarityCount: {
    [key in RARITY]: number;
  },
  drawHistory: {
    rarity: RARITY,
    name: string,
  }[],
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
    count: 0,
    rarityCount: {
      [RARITY.SSR]: 0,
      [RARITY.SR]: 0,
      [RARITY.R]: 0,
      [RARITY.N]: 0,
    },
    drawHistory: [],
  },
  mutations: {
    initGacha: (state: State, json: Gacha) => {
      state.gacha = json;
    },
    increment: (state: State, rarity: RARITY) => {
      state.count++;
      state.rarityCount[rarity]++;
    },
    addToHistory: (state: State, result: {rarity: RARITY, name: string}) => {
      state.drawHistory.push({
        rarity: result.rarity,
        name: result.name,
      });
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
