import { Gacha, RARITY } from './gacha';

export type UserItem = {
    [name in string]: {
      amount: number,
      lastUpdate: string,
    }
};
