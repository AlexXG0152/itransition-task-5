import { Injectable } from '@angular/core';
import { Faker, en, en_US, ru, zu_ZA } from '@faker-js/faker';
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

  users: IUser[] = [];
  state = 'U.S.A.';

  generateUser(): IUser {
    const fakeLocation = this.faker.location;
    const fakePerson = this.faker.person;

    const gender = `${this.faker.helpers.arrayElements(['male', 'female'], 1)}`;
    const prefix = `${this.generateFromArray(
      [fakePerson.prefix('male' || 'female'), '', ''],
      1
    )}`;
    const firstname = fakePerson.firstName(
      gender === 'male' ? 'male' : 'female'
    );
    const middlename = `${this.generateFromArray(
      [fakePerson.middleName('male' || 'female'), '', ''],
      1
    )}`;
    const lastname = fakePerson.firstName(
      gender === 'male' ? 'male' : 'female'
    );

    const direction = `${this.generateFromArray(
      [fakeLocation.ordinalDirection({ abbreviated: true }), '', ''],
      1
    )}`;

    const secondaryAddress = `${this.generateFromArray(
      [fakeLocation.secondaryAddress(), '', ''],
      1
    ).toLowerCase()}`;

    const state = fakeLocation.state({ abbreviated: true });

    const address = `${
      fakeLocation.buildingNumber()}, ${
        direction} ${
          fakeLocation.street()}, ${
            secondaryAddress}, ${
              fakeLocation.city()}, ${
                fakeLocation.county()}, ${
                  this.generateFromArray(
        [`${state}`, `${state + '-'}`, `${state + ' '}`],
        1
      )}${this.generateFromArray(
        [
          fakeLocation.zipCode('####'),
          fakeLocation.zipCode('#####'),
          fakeLocation.zipCode('######'),
        ],
        1
      )}, ${
        this.state}
        `.replace(', , ', ', ');

    return {
      number: this.users.length + 1,
      userId: this.faker.string.uuid(),
      gender: gender,
      fullname: `${prefix} ${firstname}${
        ' ' + this.generateFromArray([middlename, '', ''], 1) + ' ' || ' '
      }${lastname}`.trim(),
      address: address,
      phone: this.faker.helpers.arrayElements(
        [
          this.faker.phone.number('###-###-###'),
          this.faker.phone.number('#########'),
          this.faker.phone.number('#-##-##-##-##'),
          this.faker.phone.number('##-##-##-###'),
        ],
        1
      )[0],
    };
  }

  generateUsers(qt: number) {
    for (let index = 0; index < qt; index++) {
      this.users.push(this.generateUser());
    }
    return this.users;
  }

  generateFromArray(item: any, qt: number) {
    return `${this.faker.helpers.arrayElements([...item], qt)}`;
  }
}
