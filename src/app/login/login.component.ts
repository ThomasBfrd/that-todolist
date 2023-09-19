import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthService) {}

  btnPassword!: boolean;
  loginForm!: FormGroup;
  errorLogin : boolean = false;
  regEmail!: RegExp;

  ngOnInit(): void {

    this.regEmail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
  
    this.btnPassword = false;
    this.loginForm = this.formBuilder.group({
      email: [null, [ Validators.pattern(this.regEmail)]],
      password: [null, []]
    }, {
      updateOn: 'blur'
    }
    )
  }

  onSeePassword(): void {
    this.btnPassword = !this.btnPassword;
  }

  onSignup(): void {
    this.router.navigateByUrl('/signup')
  }

  onLogIn(): void {

    this.errorLogin = false;

    if (this.loginForm.valid) {
      this.authService.logInForm(this.loginForm.value).subscribe(
        logged => {
          console.log('Utilisateur connecté :', logged.username);
          this.authService.setCurrentUser(logged);
          this.authService.login();
          this.router.navigateByUrl('/home');
        },
        error => {
          this.errorLogin = true;
          console.error('Login error:', error);
        }
      );
    } else {
      this.errorLogin = true;
    }
  }

}
