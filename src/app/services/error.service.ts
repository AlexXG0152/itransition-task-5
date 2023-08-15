import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private storageService: StorageService) {
    this.seed = this.storageService.getSeed();
    this.numErrors = this.storageService.getErrors();
  }
  public seed: any;
  public numErrors: number;

  generateWithErrors(user: IUser, errors: number): IUser {
    this.numErrors = errors;
    const { fullname, address, phone } = user;
    const fullNameErrors = Math.floor(errors / 3) || 1;
    const addressErrors = Math.floor(errors / 3) || 1;
    const phoneErrors = errors - fullNameErrors - addressErrors || 1;

    const fields = ['address', 'fullname', 'phone'];
    const random = this.createRandomGenerator(this.seed + user.address.length);

    const errorArray = [];
    for (let i = 0; i < errors; i++) {
      const randomIndex = Math.floor(random() * fields.length);
      errorArray.push(fields[randomIndex]);
    }

    errorArray.forEach(field => {
      switch (field) {
        case 'fullname':
          user.fullname = this.generateWithErrorsForField(fullname, fullNameErrors);
          break;
        case 'address':
          user.address = this.generateWithErrorsForField(address, addressErrors);
          break;
        case 'phone':
          user.phone = this.generateWithErrorsForField(phone, phoneErrors);
          break;
      }
    });

    return user;
  }

  generateWithErrorsForField(input: string, numErrors: number): string {
    let random = this.createRandomGenerator(this.seed);
    let maxLength = input.length * 2;
    let errors = 0;
    let output = '';
    let inputLength = input.length;
    let numDigits = input.replace(/\D/g, '').length;
    let numLetters = input.replace(/[^a-zA-Z]/g, '').length;

    for (let i = 0; i < inputLength + numErrors; i++) {
      let char = i < inputLength ? input[i] : '';

      if (errors < numErrors && i < numErrors) {
        let errorType = Math.floor(random() * 3);
        if (errorType === 0) {
          errors++;
          continue;
        } else if (errorType === 1) {
          let newChar = this.generateRandomChar(random);
          if (numDigits > numLetters) {
            newChar = Math.floor(random() * 10) + '0';
          }
          char += newChar;
          if (/\d/.test(newChar)) {
            numDigits++;
          } else {
            numLetters++;
          }
          errors++;
        } else if (errorType === 2) {
          if (i < inputLength - 2) {
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

    if (output.length > maxLength) {
      output = output.slice(0, maxLength);
    }

    return output;
  }

  createRandomGenerator(seed: number): () => number {
    let m = 4294967296;
    let a = 1664525;
    let c = 1013904223;

    if (seed === undefined) {
      seed = Math.floor(Math.random() * m);
    }

    return () => {
      seed = (a * seed + c) % m;
      return seed / m;
    };
  }

  generateRandomChar(random: { (): number; (): number }): string {
    let charCode = Math.floor(random() * 26) + 97;
    return String.fromCharCode(charCode);
  }
}
