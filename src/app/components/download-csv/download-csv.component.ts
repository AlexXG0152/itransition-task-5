import { Component } from '@angular/core';
import { ExportToCSV } from '@molteni/export-csv';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-download-csv',
  templateUrl: './download-csv.component.html',
  styleUrls: ['./download-csv.component.scss'],
})
export class DownloadCSVComponent {
  constructor(private userService: UserService) {}

  exportToCSV = new ExportToCSV();

  downloadCSV() {
    const data = this.userService.users;
    const columns = [...Object.keys(data[0])];
    this.exportToCSV.exportColumnsToCSV(data, 'usersData.csv', [...columns]);
  }
}
