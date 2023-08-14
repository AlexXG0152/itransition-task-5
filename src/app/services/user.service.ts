import { Injectable } from '@angular/core';
import { Faker, SexType, en, pl, it, LocaleDefinition } from '@faker-js/faker';
import { IUser } from '../interfaces/user.interface';
import { ICountry } from '../interfaces/country.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private storageService: StorageService) {}

  countries: ICountry[] = [
    {
      name: 'United States',
      alternativeNames: [
        'USA',
        'United States',
        'US',
        'U.S.A.',
        'United States of America',
      ],
      locale: [en],
    },
    {
      name: 'Italy',
      alternativeNames: [
        'Italy',
        'Italia',
        'IT',
        'Italian Republic',
        'Republic of Italy',
      ],
      locale: [it],
    },
    {
      name: 'Poland',
      alternativeNames: [
        'Poland',
        'Polska',
        'PL',
        'RP',
        'Rzeczpospolita Polska',
      ],
      locale: [pl],
    },
  ];

  users: IUser[] = [];

  fakerEN: Faker = new Faker({
    locale: [en],
  });

  fakerPL: Faker = new Faker({
    locale: [pl],
  });

  fakerIT: Faker = new Faker({
    locale: [it],
  });

  switchFaker(locale: string): Faker {
    switch (locale) {
      case 'United States':
        return this.fakerEN;
      case 'Italy':
        return this.fakerIT;
      case 'Poland':
        return this.fakerPL;
      default:
        return this.fakerEN;
    }
  }

  clearUsers(): void {
    this.users.length = 0;
  }

  createUser(
    locale: LocaleDefinition[],
    stateNames: string[],
    faker: Faker
  ): IUser {
    return {
      number: this.users.length + 1,
      userId: faker.string.uuid(),
      fullname: this.generateFullName(faker),
      address: this.generateAddress(
        locale,
        this.generateDirection(locale, faker),
        this.generateSecondaryAddress(faker),
        this.generateState(faker),
        stateNames,
        faker
      ),
      phone: this.generatePhoneNumber(faker),
    };
  }

  generateUsers(qt: number, region: string): void {
    const countryNames = this.getCountryNames(region);
    const locale = this.getCountryLocale(region);

    for (let index = 0; index < qt; index++) {
      let user = this.createUser(
        locale,
        countryNames,
        this.switchFaker(region)
      );
      this.users.push(user);
    }
  }

  addErrorsToUsersData(errQt: number) {
    const _users = this.users;
    if (errQt > 0) {
      const fields = ['fullname', 'address', 'phone'];

      let errorField: keyof IUser | string, errorType: number, errorPos: number;

      _users.map((user) => {
        for (let index = 0; index < errQt; index++) {
          const errorsRandom = this.generateRandomSequence(
            this.storageService.getSeed(),
            this.roundNumber(errQt, this.storageService.getSeed(), index) * 3
          );

          let prevField;
          let prevType;
          let prevPos;

          for (let i = 0; i < errorsRandom.length; i += 3) {
            if (i % 1 === 0) {
              errorField =
                fields[(errorsRandom[i] % user['address'].length) % 3];
              if (prevField === errorField) {
                errorField =
                  fields[((errorsRandom[i] % user['address'].length) - 1) % 3];
              } else {
                prevField = errorField;
              }
            }
            if (i % 2 === 0) {
              errorType = (errorsRandom[i] % user['fullname'].length) % 3;
              if (prevType === errorType) {
                errorType =
                  ((errorsRandom[i] % user['fullname'].length) - 1) % 3;
              } else {
                prevType = errorType;
              }
            }
            if (i % 3 === 0) {
              errorPos = errorField.length % errorsRandom[i];
              if (prevPos === errorPos) {
                errorPos = (errorField.length - 1) % errorsRandom[i];
              } else {
                prevPos = errorPos;
              }
            }
            // console.log(errorField!, errorType!, errorPos!);

            this.choiceErrorType(
              user,
              errorField! as keyof IUser,
              errorType!,
              errorPos!
            );
          }
        }
      });
    }
    // return _users
  }

  getRandomFromArray(item: any, qt: number, faker: Faker) {
    return `${faker.helpers.arrayElements([...item], qt)}`;
  }

  generatePrefix(gender: string, faker: Faker): string {
    return `${this.getRandomFromArray(
      [faker.person.prefix(gender as SexType), '', ''],
      1,
      faker
    )}`;
  }

  generateFirstName(gender: string, faker: Faker): string {
    return faker.person.firstName(gender as SexType);
  }

  generateMiddleName(gender: string, faker: Faker): string {
    return `${this.getRandomFromArray(
      [faker.person.middleName(gender as SexType), '', ''],
      1,
      faker
    )}`;
  }

  generateLastName(gender: string, faker: Faker): string {
    return faker.person.firstName(gender as SexType);
  }

  generateFullName(faker: Faker) {
    return `${faker.person.fullName()}`.trim();
  }

  generateDirection(locale: LocaleDefinition[], faker: Faker): string {
    return locale[0].metadata?.code === 'en'
      ? `${this.getRandomFromArray(
          [faker.location.ordinalDirection({ abbreviated: true }), '', ''],
          1,
          faker
        )}`
      : '';
  }

  generateSecondaryAddress(faker: Faker): string {
    return `${this.getRandomFromArray(
      [faker.location.secondaryAddress(), '', ''],
      1,
      faker
    ).toLowerCase()}`;
  }

  generateCounty(locale: LocaleDefinition[], faker: Faker) {
    return locale[0].metadata?.code === 'en'
      ? faker.location.county() + ','
      : '';
  }

  generateState(faker: Faker): string {
    return faker.location.state({ abbreviated: true });
  }

  getCountryNames(select: string): string[] {
    const country: ICountry = this.countries.find(
      (item) => item.name === select
    )!;
    const values: string[] = country.alternativeNames;
    return values;
  }

  getCountryLocale(select: string): LocaleDefinition[] {
    const country: ICountry = this.countries.find(
      (item) => item.name === select
    )!;
    const locales: LocaleDefinition[] = country.locale;
    return locales;
  }

  choiseCountryNames(countryNames: string[], faker: Faker): string {
    return `${this.getRandomFromArray(countryNames, 1, faker)}`;
  }

  generateAddress(
    locale: LocaleDefinition[],
    direction: string,
    secondaryAddress: string,
    state: string,
    countryNames: string[],
    faker: Faker
  ): string {
    if (locale[0].metadata?.code === 'en') {
      return `${faker.location.buildingNumber()}, ${direction} ${faker.location.street()}, ${secondaryAddress}, ${faker.location.city()}, ${this.generateCounty(
        locale,
        faker
      )}, ${this.getRandomFromArray(
        [`${state}`, `${state + '-'}`, `${state + ' '}`],
        1,
        faker
      )}${this.getRandomFromArray(
        [faker.location.zipCode('####'), faker.location.zipCode('#####')],
        1,
        faker
      )}, ${this.choiseCountryNames(countryNames, faker)}`
        .replaceAll(', , ', ', ')
        .replaceAll(',,', ',');
    } else {
      return `${direction} ${faker.location.street()}, ${faker.location.buildingNumber()}, ${secondaryAddress}, ${faker.location.city()}, ${this.generateCounty(
        locale,
        faker
      )}, ${this.getRandomFromArray(
        [`${state}`, `${state + '-'}`, `${state + ' '}`],
        1,
        faker
      )}${this.getRandomFromArray(
        [faker.location.zipCode('####'), faker.location.zipCode('#####')],
        1,
        faker
      )}, ${this.choiseCountryNames(countryNames, faker)}`
        .replaceAll(', , ', ', ')
        .replaceAll(',,', ',');
    }
  }

  generatePhoneNumber(faker: Faker): string {
    return faker.phone.number().replaceAll('.', '-').split('x')[0].trim();
  }

  choiceErrorType(
    user: IUser,
    errorField: keyof IUser,
    errorType: number,
    errorPos: number
  ): IUser {
    const functions = [
      this.deleteOneRandomSymbolError(user, errorField, errorPos),
      this.addOneRandomSymbolError(user, errorField, errorPos),
      this.swapRandomAdjacentCharacters(user, errorField, errorPos),
    ];
    return functions[errorType];
  }

  deleteOneRandomSymbolError(
    user: IUser,
    errorField: keyof IUser,
    errorPos: number
  ): IUser {
    if ((user[errorField] as string)[errorPos] === ' ') {
      errorPos = errorPos + 1;
    }
    (user[errorField] as string) =
      (user[errorField] as string).slice(0, errorPos) +
      (user[errorField] as string).slice(errorPos + 1);
    return user;
  }

  addOneRandomSymbolError(
    user: IUser,
    errorField: keyof IUser,
    errorPos: number
  ): IUser {
    if ((user[errorField] as string)[errorPos] === ' ') {
      errorPos = errorPos + 1;
    }
    let newChar;

    if (
      !!(user[errorField] as string).includes(
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
      )
    ) {
      newChar = '0123456789'.split('')[errorPos] || '';
    } else {
      newChar =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')[
          errorPos
        ] || 'r';
    }

    if (errorPos < errorPos || errorPos > (user[errorField] as string).length) {
      console.error('Index is out of range');
    }

    (user[errorField] as string) =
      (user[errorField] as string).slice(0, errorPos) +
      newChar +
      (user[errorField] as string).slice(errorPos);

    return user;
  }

  swapRandomAdjacentCharacters(
    user: IUser,
    errorField: keyof IUser,
    errorPos: number
  ): IUser {
    const characters = (user[errorField] as string).split('');
    if ((user[errorField] as string)[errorPos] === ' ') {
      errorPos = errorPos + 1;
    }
    const temp = characters[errorPos];

    characters[errorPos] = characters[errorPos + 1];
    characters[errorPos + 1] = temp;
    (user[errorField] as string) = characters.join('');

    return user;
  }

  generateRandomSequence(seed: number, length: number): number[] {
    const sequence: number[] = [];
    let currentValue = seed;

    for (let i = 0; i < length; i++) {
      currentValue = (currentValue * 16807) % 2147483647;
      sequence.push(currentValue);
    }

    return sequence;
  }

  roundNumber(errQt: number, seed: number, iteration: number): number {
    const roundedNum = Math.round(errQt);
    const adjustment = seed + iteration;

    if (errQt % 1 === 0.5) {
      if (adjustment % 2 === 0) {
        return Math.floor(errQt);
      } else {
        return Math.ceil(errQt);
      }
    }

    return roundedNum;
  }
}
