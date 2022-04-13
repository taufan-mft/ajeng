import Dexie, { Table } from 'dexie';

export interface Friend {
  id?: number;
  shopName: string;
  name: string;
  kKNumber: string;
  nik: string;
  address: string;
  npwp: string;
  weight: string;
  timeStamp: Date;
}

export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  friends!: Table<Friend>;

  constructor() {
    super('myDatabase23');
    this.version(2).stores({
      friends:
        '++id, shopName, name, kKNumber, nik, address, npwp, weight, timeStamp, [kKNumber+timeStamp], [name+timeStamp]', // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
