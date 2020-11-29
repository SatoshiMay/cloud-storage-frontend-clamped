import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IndexModule } from './index/index.module';
import { WelcomeModule } from './welcome/welcome.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    WelcomeModule,
    IndexModule,
    AuthModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
