import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { DownloadCSVComponent } from './components/download-csv/download-csv.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, DownloadCSVComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, InfiniteScrollModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
