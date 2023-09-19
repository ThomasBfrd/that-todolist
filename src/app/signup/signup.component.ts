import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../services/tasks.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {}

  btnPassword!: boolean;
  signupForm!: FormGroup
  errorSignup : boolean = false;
  messagePassword : boolean = false;
  regEmail!: RegExp;


  ngOnInit(): void {

    this.regEmail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
  
    this.btnPassword = false;

    this.signupForm = this.formBuilder.group({
      username: [null],
      email: [null, [Validators.email, Validators.pattern(this.regEmail)]],
      password: [null],
    }, {
      updateOn: 'blur'
    })
  }

  onSeePassword(): void {
    this.btnPassword = !this.btnPassword;
  }

  onSignUp(): void {

    if (this.signupForm.valid) {
      this.authService.signUp(this.signupForm.value).pipe(
        tap(() => this.router.navigateByUrl('/home'))
      ).subscribe(
        () => {},
        error => {
          this.errorSignup = true;
          console.error('Signup error:', error);
        }
      );
    } else {
      this.errorSignup = true;
    }
  }

  onPreventPassword(): void {

    this.messagePassword = false;

    if (this.messagePassword === false) {
      this.messagePassword = true;
    } else {
      this.messagePassword = false;
    }

  }
  
}
