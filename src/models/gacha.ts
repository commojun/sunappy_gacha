import { Store } from 'vuex';
import { Gacha } from '../store/store';

// 参考
// https://www.kabuku.co.jp/developers/good-bye-typescript-enum
const RARITY = {
  SSR: "SSR",
  SR: "SR",
  R: "R",
  N: "N",
} as const;
export type RARITY = typeof RARITY[keyof typeof RARITY];

export type GachaResult = {
  rarity: RARITY,
  name: string,
}

export class GachaModel {
  protected readonly config: Gacha;

  constructor(config: Gacha) {
    this.config = config;
  }

  private random(max: number): number {
    return Math.floor(Math.random() * max);
  }

  draw(): GachaResult {
    const rarity = this.drawRarity();
    // レアリティ抽選に基づいてテーブルを決定
    let table: string[];
    if (rarity == RARITY.SSR) table = this.config.table.ssr_items;
    else if (rarity == RARITY.SR) table = this.config.table.sr_items;
    else if (rarity == RARITY.R) table = this.config.table.sr_items;
    else table = this.config.table.n_items;

    // tableから無作為抽出
    const lot: number = this.random(table.length);
    const name: string = table[lot];

    return {
      rarity: rarity,
      name: name,
    };
  }

  drawRarity(): RARITY {
    const emissionRate = this.config.emission_rate;
    let totalRate: number = 0;
    for (const odds of Object.values(emissionRate)) {
      totalRate += odds;
    }
    let lot: number = this.random(totalRate);
    console.log("lot:"+lot);
    if      ((lot -= emissionRate.ssr_odds) < 0) return RARITY.SSR;
    else if ((lot -= emissionRate.sr_odds)  < 0) return RARITY.SR;
    else if ((lot -= emissionRate.r_odds)   < 0) return RARITY.R;
    else return RARITY.N;
  }
}
