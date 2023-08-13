import { Injectable } from '@angular/core';
import { Faker, SexType, en, pl, it, LocaleDefinition } from '@faker-js/faker';
import { IUser } from '../interfaces/user.interface';
import { ICountry } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

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
      this.users.push(
        this.createUser(locale, countryNames, this.switchFaker(region))
      );
    }
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
  }

  generatePhoneNumber(faker: Faker): string {
    return faker.phone.number().replaceAll('.', '-').split('x')[0].trim();
  }

  choiceErrorType(inputString: string): string {
    const randomPosition = Math.floor(Math.random() * 2);
    const functions = [
      this.deleteOneRandomSymbolError(inputString),
      this.addOneRandomSymbolError(inputString, 'w'),
      this.swapRandomAdjacentCharacters(inputString),
    ];
    return functions[randomPosition];
  }

  deleteOneRandomSymbolError(inputString: string): string {
    if (inputString.length === 0) {
      throw new Error('Empty String');
    }

    const randomIndex = Math.floor(Math.random() * inputString.length);
    return (
      inputString.slice(0, randomIndex) + inputString.slice(randomIndex + 1)
    );
  }

  addOneRandomSymbolError(inputString: string, newChar: string): string {
    const randomPosition = Math.floor(Math.random() * inputString.length);
    return (
      inputString.slice(0, randomPosition) +
      newChar +
      inputString.slice(randomPosition)
    );
  }

  swapRandomAdjacentCharacters(inputString: string): string {
    const characters = inputString.split('');
    const randomIndex = Math.floor(Math.random() * (characters.length - 1));
    const temp = characters[randomIndex];

    characters[randomIndex] = characters[randomIndex + 1];
    characters[randomIndex + 1] = temp;

    return characters.join('');
  }
}
