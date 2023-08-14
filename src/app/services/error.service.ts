import { Inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private storageService: StorageService) {
    this.seed = this.storageService.getSeed();
  }
  public seed: any;

  generateWithErrors(input: string, numErrors: number) {
    let random = this.createRandomGenerator();
    let length = input.length;
    let errors = 0;
    let output = '';

    for (let i = 0; i < length; i++) {
      let char = input[i];

      if (
        errors < numErrors &&
        random() < (numErrors - errors) / (length - i)
      ) {
        let errorType = Math.floor(random() * 3);
        if (errorType === 0) {
          errors++;
          continue;
        } else if (errorType === 1) {
          let newChar = this.generateRandomChar(random);
          if (/\d/.test(input[input.length - 1])) {
            newChar = Math.floor(random() * 10) + '0';
          }
          char += newChar;
          errors++;

        } else if (errorType === 2) {
          if (i < length - 2) {
            let inputArray = Array.from(input);
            [inputArray[i], inputArray[i + 2]] = [
              inputArray[i + 2],
              inputArray[i],
            ];
            input = inputArray.join('');
          }
          errors++;
        }
      }

      output += char;
    }

    return output;
  }

  createRandomGenerator() {
    let m = 4294967296;
    let a = 1664525;
    let c = 1013904223;

    let seed = this.seed;

    if (seed === undefined) {
      seed = Math.floor(Math.random() * m);
    }

    return () => {
      seed = (a * seed + c) % m;
      return seed / m;
    };
  }

  generateRandomChar(random: { (): number; (): number }) {
    let charCode = Math.floor(random() * 26) + 97;
    return String.fromCharCode(charCode);
  }
}
