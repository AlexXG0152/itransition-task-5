import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private userService: UserService) {}
  throttle = 0;
  distance = 2;
  page = 1;

  dropDownData: string[] = [
    'Region',
    ...this.userService.countries.map((country) => country.name),
  ];

  errorsQt: Event | number = 0;
  seed: number = 0;

  state: string = this.dropDownData[1];

  tableData?: IUser[] = this.userService.users;

  ngOnInit(): void {
    // this.userService.generateUsers(10, this.state);
  }

  onOptionsSelected(value: string): string | undefined {
    this.userService.clearUsers();

    if (value === 'Region') {
      return;
    }

    this.userService.generateUsers(this.seed, 10, value);
    return (this.state = value);
  }

  onRandomClick(max: number): number {
    console.log(Math.floor(Math.random() * max));

    return Math.floor(Math.random() * max);
  }

  onScroll(): void {
    this.userService.generateUsers(this.seed, 10, this.state);

    // .subscribe((newUsers: IUser[]) => {
    //   this.userService.users.push(...newUsers);
    // });
  }
}
