import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user.interface';

const SEED = 'seed';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  clear(): void {
    window.localStorage.clear();
  }

  public saveSeed(seed: number): void {
    window.localStorage.removeItem(SEED);
    window.localStorage.setItem(SEED, seed.toString());
  }

  public getSeed(): number {
    return Number(localStorage.getItem(SEED));
  }
}
