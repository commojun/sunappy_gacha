import { Store } from 'vuex';
import { State } from '../store/store';
import { Gacha, GachaResult, RARITY } from './gacha';

export type UserData = {
  count: number,
  rarityCount: {
    [key in RARITY]: number;
  },
  drawHistory: {
    rarity: RARITY,
    name: string,
  }[],
  userItem: {
    [name in string]: UserItem;
  },
};

export type UserItem = {
  amount: number,
  lastUpdate: Date,
};

export class LibraryModel {
  protected store: Store<State>;

  constructor(store: Store<State>) {
    this.store = store;
  }

  private updateUserItem(result: GachaResult): void {
    if(this.store.state.userData.userItem[result.name]) {
      this.store.commit("updateGachaItem", result);
    }
    else {
      this.store.commit("newGachaItem", result);
    }
  }

  updateUserData(result: GachaResult): void {
    console.log("asfja;oeifja;oi");
    // 回数のインクリメント
    this.store.commit("increment", result.rarity);
    // 履歴の追加
    this.store.commit("addToHistory", result);

    this.updateUserItem(result);
  }

}
