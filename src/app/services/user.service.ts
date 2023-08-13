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

  // faker!: Faker;
  faker: Faker = new Faker({
    locale: [en],
  });

  initFaker(locale: any): Faker {
    return new Faker({
      locale: locale,
    });
  }

  clearUsers(): void {
    this.users.length = 0;
  }

  createUser(locale: LocaleDefinition[], stateNames: string[]): IUser {
    return {
      number: this.users.length + 1,
      userId: this.faker.string.uuid(),
      fullname: this.generateFullName(locale, this.faker.person.sex()),
      address: this.generateAddress(
        locale,
        this.generateDirection(locale),
        this.generateSecondaryAddress(),
        this.generateState(),
        stateNames
      ),
      phone: this.generatePhoneNumber(),
    };
  }

  generateUsers(qt: number, region: string): void {
    const countryNames = this.getCountryNames(region);
    const locale = this.getCountryLocale(region);

    // if (!this.faker) {
    //   this.faker = this.initFaker(locale);
    // }

    // this.faker.seed(this.storageService.getSeed());
    for (let index = 0; index < qt; index++) {
      this.users.push(this.createUser(locale, countryNames));
    }
  }

  getRandomFromArray(item: any, qt: number) {
    return `${this.faker.helpers.arrayElements([...item], qt)}`;
  }

  generatePrefix(gender: string): string {
    return `${this.getRandomFromArray(
      [this.faker.person.prefix(gender as SexType), '', ''],
      1
    )}`;
  }

  generateFirstName(gender: string): string {
    return this.faker.person.firstName(gender as SexType);
  }

  generateMiddleName(gender: string): string {
    return `${this.getRandomFromArray(
      [this.faker.person.middleName(gender as SexType), '', ''],
      1
    )}`;
  }

  generateLastName(gender: string): string {
    return this.faker.person.firstName(gender as SexType);
  }

  generateFullName(locale: LocaleDefinition[], gender: string) {
    return `${this.faker.person.fullName({ sex: gender as SexType })}`.trim();
  }

  generateDirection(locale: LocaleDefinition[]): string {
    return locale[0].metadata?.code === 'en'
      ? `${this.getRandomFromArray(
          [this.faker.location.ordinalDirection({ abbreviated: true }), '', ''],
          1
        )}`
      : '';
  }

  generateSecondaryAddress(): string {
    return `${this.getRandomFromArray(
      [this.faker.location.secondaryAddress(), '', ''],
      1
    ).toLowerCase()}`;
  }

  generateCounty(locale: LocaleDefinition[]) {
    return locale[0].metadata?.code === 'en'
      ? this.faker.location.county() + ','
      : '';
  }

  generateState(): string {
    return this.faker.location.state({ abbreviated: true });
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

  choiseCountryNames(countryNames: string[]): string {
    return `${this.getRandomFromArray(countryNames, 1)}`;
  }

  generateAddress(
    locale: LocaleDefinition[],
    direction: string,
    secondaryAddress: string,
    state: string,
    countryNames: string[]
  ): string {
    return `${this.faker.location.buildingNumber()}, ${direction} ${this.faker.location.street()}, ${secondaryAddress}, ${this.faker.location.city()}, ${this.generateCounty(
      locale
    )}, ${this.getRandomFromArray(
      [`${state}`, `${state + '-'}`, `${state + ' '}`],
      1
    )}${this.getRandomFromArray(
      [
        this.faker.location.zipCode('####'),
        this.faker.location.zipCode('#####'),
      ],
      1
    )}, ${this.choiseCountryNames(countryNames)}`
      .replaceAll(', , ', ', ')
      .replaceAll(',,', ',');
  }

  generatePhoneNumber(): string {
    return this.faker.phone.number().replaceAll('.', '-').split('x')[0].trim();
  }
}
