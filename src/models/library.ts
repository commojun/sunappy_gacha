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
  userItems: {
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
  order: number,
};

export class LibraryModel {
  private store: Store<State>;
  protected items: LibraryItem[];
  protected order: number = 1;

  constructor(store: Store<State>) {
    this.store = store;
    this.items = this.initLibraryItems();
  }

  private updateUserItem(result: GachaResult): void {
    if(this.store.state.userData.userItems[result.name]) {
      this.store.commit("updateGachaItem", result);
    }
    else {
      this.store.commit("newGachaItem", result);
    }
  }

  private calcOrder(rarity: RARITY): number{
    let rarityOffset = 0;
    switch(rarity) {
      case RARITY.SR:
        rarityOffset = 1000;
        break;
      case RARITY.R:
        rarityOffset = 1000000;
        break;
      case RARITY.N:
        rarityOffset = 1000000000;
        break;
      default:
    }
    const result = this.order + rarityOffset;
    this.order++;
    return result;
  }

  private initLibraryItems(): LibraryItem[] {
    const gacha: Gacha = this.store.state.gacha;
    const items: LibraryItem[] = [];

    for (const rarity of Object.values(RARITY)) {
      for (const name of gacha.table[rarity]){
        items.push({
          name: name,
          rarity: rarity,
          order: this.calcOrder(rarity),
        });
      }
    }
    items.sort((a, b) => {
      return a.order - b.order;
    });
    return items;
  }

  updateUserData(result: GachaResult): void {
    // 回数のインクリメント
    this.store.commit("increment", result.rarity);
    // 履歴の追加
    this.store.commit("addToHistory", result);

    this.updateUserItem(result);
  }

}
