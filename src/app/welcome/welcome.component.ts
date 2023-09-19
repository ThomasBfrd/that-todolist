import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(private router: Router,
              private authService: AuthService) {}

  ngOnInit(): void {
      
  }

  onLogin(): void {
    this.router.navigateByUrl('/login')
  }

}
