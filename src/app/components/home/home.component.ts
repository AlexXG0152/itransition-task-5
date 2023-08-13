import { Component } from '@angular/core';
import { IUser } from 'src/app/interfaces/user.interface';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  user: any;
  constructor(
    private userService: UserService,
    private storageService: StorageService
  ) {}
  throttle = 0;
  distance = 2;
  page = 1;

  dropDownData: string[] = [
    'Region',
    ...this.userService.countries.map((country) => country.name),
  ];

  errorsQt: Event | number = 0;

  seed: string = '0';

  region: string = this.dropDownData[1];

  tableData?: IUser[] = this.userService.users;

  onOptionsSelected(value: string): void | undefined {
    this.storageService.saveSeed(Number(this.seed));
    this.userService.clearUsers();

    if (value === 'Region') {
      return;
    }

    this.region = value;

    this.userService.faker.seed(this.storageService.getSeed() + this.page);
    this.userService.generateUsers(20, value);
  }

  onSeedEnter(value: string): void {
    if (this.storageService.getSeed() !== Number(value)) {
      this.storageService.saveSeed(Number(value));
    }
    console.log('from Enter', value);
    this.userService.faker.seed(this.storageService.getSeed() + this.page);
    this.userService.clearUsers();
    this.userService.generateUsers(20, this.region);
  }

  onRandomClick(): void {
    const randomNumber = Math.floor(Math.random() * 9_999_999);
    if (this.storageService.getSeed() !== Number(randomNumber)) {
      this.storageService.saveSeed(Number(randomNumber));
      this.seed = String(randomNumber);
    }
    console.log('from randomNumber', randomNumber);
    this.userService.faker.seed(this.storageService.getSeed() + this.page);
    this.userService.clearUsers();
    this.userService.generateUsers(20, this.region);
  }

  onScroll(): void {
    this.userService.generateUsers(10, this.region);
  }
}
