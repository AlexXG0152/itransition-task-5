import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/iuser';
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
    ...this.userService.countries.map((country) => Object.keys(country)[0]),
  ];

  state: string = this.dropDownData[1];

  tableData?: IUser[] = this.userService.users;

  ngOnInit(): void {
    // this.userService.generateUsers(10, this.state);
  }

  onOptionsSelected(value: string) {
    this.userService.clearUsers()
    this.userService.generateUsers(10, value);
    return (this.state = value);
  }

  onScroll(): void {
    this.userService.generateUsers(10, this.state);

    // .subscribe((commentaries: Comment[]) => {
    //   this.userService.users.push(...commentaries);
    // });
  }
}
