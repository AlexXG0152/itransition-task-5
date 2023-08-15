import { Injectable } from '@angular/core';

const SEED = 'seed';
const ERRORS = 'errors';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  clear(): void {
    window.localStorage.clear();
  }

  saveSeed(seed: number): void {
    window.localStorage.removeItem(SEED);
    window.localStorage.setItem(SEED, seed.toString());
  }

  getSeed(): number {
    return Number(localStorage.getItem(SEED));
  }

  saveErrors(errors: number): void {
    window.localStorage.removeItem(ERRORS);
    window.localStorage.setItem(ERRORS, errors.toString());
  }

  getErrors(): number {
    return Number(localStorage.getItem(ERRORS));
  }
}
