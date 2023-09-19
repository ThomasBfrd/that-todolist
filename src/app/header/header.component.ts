import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) {}

  isLogged: boolean = false;
  buttonMenu: boolean = false;

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe(loggedIn => {
      this.isLogged = loggedIn
    })
    
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/')
  }

  onMenu(): void {
    this.buttonMenu = true;
  }

  closeMenu(): void {
    this.buttonMenu = false;
  }
}
