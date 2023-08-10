import { Injectable } from '@angular/core';
import { Faker, SexType, en, en_US, pl, zu_ZA } from '@faker-js/faker';
import { IUser } from '../interfaces/iuser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  faker = new Faker({
    locale: [en_US, en],
  });
  // faker.seed(123);

  countries = [
    {
      'United States': [
        'USA',
        'US',
        'United States',
        'U.S.A.',
        'United States of America',
      ],
    },
    {
      'Zulu (South Africa)': [
        'S.Africa',
        'SA',
        'RSA',
        'South Africa',
        'Republic of South Africa',
      ],
    },
    {
      'Poland': [
        'PL',
        'Poland',
        'Polska',
        'Rzeczpospolita',
        'Rzeczpospolita Polska',
      ],
    },
  ];

  users: IUser[] = [];

  clearUsers(): void {
    this.users.length = 0;
  }

  generateUser(stateNames: string): IUser {
    const gender = `${this.generateGender()}`;
    return {
      number: this.users.length + 1,
      userId: this.faker.string.uuid(),
      gender: gender,
      fullname: this.generateFullName(gender),
      address: this.generateAddress(
        this.generateDirection(),
        this.generateSecondaryAddress(),
        this.generateState(),
        stateNames
      ),
      phone: this.generatePhoneNumber(),
    };
  }

  generateUsers(qt: number, state: string) {
    const countryNames = this.getCountryNames(state);

    for (let index = 0; index < qt; index++) {
      this.users.push(this.generateUser(countryNames));
    }
    return this.users;
  }

  getRandomFromArray(item: any, qt: number) {
    return `${this.faker.helpers.arrayElements([...item], qt)}`;
  }

  generateGender(): string {
    return ['female', 'male'][
      Math.floor(Math.random() * ['female', 'male'].length)
    ];
  }

  generatePrefix(): string {
    return `${this.getRandomFromArray(
      [this.faker.person.prefix('male' || 'female'), '', ''],
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

  generateFullName(gender: string) {
    return `${this.generatePrefix()} ${this.generateFirstName(gender)} ${
      this.generateMiddleName(gender)
        ? this.generateMiddleName(gender) + ' '
        : ''
    }${this.generateLastName(gender)}`.trim();
  }

  generateDirection(): string {
    return `${this.getRandomFromArray(
      [this.faker.location.ordinalDirection({ abbreviated: true }), '', ''],
      1
    )}`;
  }

  generateSecondaryAddress(): string {
    return `${this.getRandomFromArray(
      [this.faker.location.secondaryAddress(), '', ''],
      1
    ).toLowerCase()}`;
  }

  generateState(): string {
    return this.faker.location.state({ abbreviated: true });
  }

  getCountryNames(select: string): string {
    const key = this.countries.find((country) =>
      country.hasOwnProperty(select)
    );
    const values = key ? Object.values(key)[0] : null;
    return values;
  }

  choiseCountryNames(countryNames: string): string {
    return `${this.getRandomFromArray(countryNames, 1)}`;
  }

  generateAddress(
    direction: string,
    secondaryAddress: string,
    state: string,
    countryNames: string
  ): string {
    return `${this.faker.location.buildingNumber()}, ${direction} ${this.faker.location.street()}, ${secondaryAddress}, ${this.faker.location.city()}, ${this.faker.location.county()}, ${this.getRandomFromArray(
      [`${state}`, `${state + '-'}`, `${state + ' '}`],
      1
    )}${this.getRandomFromArray(
      [
        this.faker.location.zipCode('####'),
        this.faker.location.zipCode('#####'),
        this.faker.location.zipCode('######'),
      ],
      1
    )}, ${this.choiseCountryNames(countryNames)}
      `.replace(', , ', ', ');
  }

  generatePhoneNumber(): string {
    return this.faker.phone.number().replaceAll('.', '-').split('x')[0].trim();
  }
}
