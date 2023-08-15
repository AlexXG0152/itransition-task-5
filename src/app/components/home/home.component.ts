import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/user.interface';
import { ErrorService } from 'src/app/services/error.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.storageService.clear();
    this.storageService.saveSeed(1);
    this.storageService.saveErrors(0);
    this.setSeedToFaker(this.region);
    this.userService.generateUsers(20, this.region);
  }

  throttle = 0;
  distance = 2;
  page = 1;

  dropDownData: string[] = [
    ...this.userService.countries.map((country) => country.name),
  ];

  errorsQt: number = 0;
  seed: string = '1';
  region: string = this.dropDownData[0];
  tableData?: IUser[] = this.userService.users;

  onOptionsSelected(value: string): void | undefined {
    this.errorsQt = 0;
    this.storageService.saveSeed(Number(this.seed));
    this.userService.clearUsers();

    this.region = value;

    this.setSeedToFaker(this.region);

    this.userService.generateUsers(20, this.region);
  }

  onChangeErrorsQt($event: number) {
    this.errorsQt = $event;
    this.userService.clearUsers();
    this.storageService.saveSeed(Number(this.seed));
    this.storageService.saveErrors(this.errorsQt);
    this.setSeedToFaker(this.region);
    this.userService.generateUsers(20, this.region);

    this.userService.users.map((_i, index) => {
      this.errorService.generateWithErrors(
        this.userService.users[index],
        this.errorsQt
      );
    });
  }

  onSeedEnter(value: string): void {
    this.errorsQt = 0;
    if (this.storageService.getSeed() !== Number(value)) {
      this.storageService.saveSeed(Number(value));
    }

    this.setSeedToFaker(this.region);
    this.userService.clearUsers();
    this.userService.generateUsers(20, this.region);
  }

  onRandomClick(): void {
    this.errorsQt = 0;
    const randomNumber = Math.floor(Math.random() * 9_999_999);
    if (this.storageService.getSeed() !== Number(randomNumber)) {
      this.storageService.saveSeed(Number(randomNumber));
      this.seed = String(randomNumber);
    }

    // this.userService.faker.seed(this.storageService.getSeed() + this.page);
    this.setSeedToFaker(this.region);
    this.userService.clearUsers();
    this.userService.generateUsers(20, this.region);
  }

  onScroll(): void {
    this.userService.generateUsers(20, this.region);
  }

  setSeedToFaker(locale: string) {
    switch (locale) {
      case 'United States':
        this.userService.fakerEN.seed(
          this.storageService.getSeed() + this.page
        );
        break;
      case 'Italy':
        this.userService.fakerIT.seed(
          this.storageService.getSeed() + this.page
        );
        break;
      case 'Poland':
        this.userService.fakerPL.seed(
          this.storageService.getSeed() + this.page
        );
        break;
      default:
        this.userService.fakerEN.seed(
          this.storageService.getSeed() + this.page
        );
        break;
    }
  }
}
