import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title: string = 'BUY $ SELL';
  currentUser: User;

  constructor(private authService: AuthenticationService){
    this.currentUser = null;
  }
  ngOnInit():void {
    this.authService.getCurrentUser()
    .subscribe((user: string) => {
      if (user) {
        this.currentUser = JSON.parse(user);
      }else {
        this.currentUser = null;
      }
    });  
  }

  signOut(): void {
    this.authService.removeCurrentUser();
  }
}
