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

export type LibraryItem = {
  name: string,
  rarity: RARITY,
  amount: number,
  lastUpdate: Date | null,
};

export class LibraryModel {
  protected store: Store<State>;
  protected items: LibraryItem[];

  constructor(store: Store<State>) {
    this.store = store;
    this.items = this.initLibraryItems();
  }

  private initLibraryItems(): LibraryItem[] {
    const gacha: Gacha = this.store.state.gacha;
    const userData: UserData = this.store.state.userData;
    const items: LibraryItem[] = [];
    for (const rarity of Object.values(RARITY)) {
      for (const name of gacha.table[rarity]){
        const amount = userData.userItem[name] ? userData.userItem[name].amount : 0;
        const lastUpdate = userData.userItem[name] ? userData.userItem[name].lastUpdate : null;
        items.push({
          name: name,
          rarity: rarity,
          amount: amount,
          lastUpdate: lastUpdate,
        });
      }
    }
    return items;
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
