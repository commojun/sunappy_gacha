import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';

export type Gacha = {
  emission_rate: {
    ssr_odds: number,
    sr_odds: number,
    r_odds: number,
    n_odds: number,
  },
  table: {
    ssr_items: string[],
    sr_items: string[],
    r_items: string[],
    n_items: string[],
  },
};

export type State = {
  gacha: Gacha,
  count: number,
};

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    gacha: {
      emission_rate: {
        ssr_odds: 0,
        sr_odds: 0,
        r_odds: 0,
        n_odds: 0,
      },
      table: {
        ssr_items: [],
        sr_items: [],
        r_items: [],
        n_items: [],
      },
    },
    count: 0,
  },
  mutations: {
    initGacha: (state: State, json: Gacha) => {
      state.gacha = json;
    },
    increment: (state: State) => {
      state.count++;
    },
  },
});
