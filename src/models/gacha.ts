import { Store } from 'vuex';
import { State } from '../store/store';
// 参考
// https://www.kabuku.co.jp/developers/good-bye-typescript-enum
export const RARITY = {
  SSR: "SSR",
  SR: "SR",
  R: "R",
  N: "N",
} as const;
export type RARITY = typeof RARITY[keyof typeof RARITY];

export type Gacha = {
  emission_rate: {
    [key in RARITY]: number;
  },
  table: {
    [key in RARITY]: string[];
  },
};

export type GachaResult = {
  rarity: RARITY,
  name: string,
}

export class GachaModel {
  protected readonly config: Gacha;
  protected store: Store<State>;

  constructor(store: Store<State>) {
    this.store = store;
    this.config = store.state.gacha;
  }

  private random(max: number): number {
    return Math.floor(Math.random() * max);
  }

  draw(): GachaResult {
    const rarity = this.drawRarity();
    // レアリティ抽選に基づいてテーブルを決定
    let table: string[];
    if (rarity == RARITY.SSR) table = this.config.table[RARITY.SSR];
    else if (rarity == RARITY.SR) table = this.config.table[RARITY.SR];
    else if (rarity == RARITY.R) table = this.config.table[RARITY.R];
    else table = this.config.table[RARITY.N];

    // tableから無作為抽出
    const lot: number = this.random(table.length);
    const name: string = table[lot];

    const result = {
      rarity: rarity,
      name: name,
    };

    // 回数のインクリメント
    this.store.commit("increment", rarity);
    // 履歴の追加
    this.store.commit("addToHistory", result);

    return result;
  }

  drawRarity(): RARITY {
    const emissionRate = this.config.emission_rate;
    let totalRate: number = 0;
    for (const odds of Object.values(emissionRate)) {
      totalRate += odds;
    }
    let lot: number = this.random(totalRate);
    console.log("lot:"+lot);
    if      ((lot -= emissionRate[RARITY.SSR]) < 0) return RARITY.SSR;
    else if ((lot -= emissionRate[RARITY.SR])  < 0) return RARITY.SR;
    else if ((lot -= emissionRate[RARITY.R])   < 0) return RARITY.R;
    else return RARITY.N;
  }
}
