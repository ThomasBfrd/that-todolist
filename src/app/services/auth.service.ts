import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: boolean = false;
  token: string | null = null;
  username: string | null = null;
  currentUser: User | null = null;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {
      const storedToken = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');
      if (storedToken) {
      this.token = storedToken;
      this.username = storedUsername;
      this.loggedIn = true;
      this.currentUserSubject.next(this.currentUser);
      this.loggedInSubject.next(true);
    }
  }

  setToken(token: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setCurrentUser(user: User | null) {
    this.currentUserSubject.next(user);
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  login() {
    this.loggedIn = true;
    this.loggedInSubject.next(true);
  }

  logout() {
    this.loggedIn = false;
    this.token = null;
    this.currentUser = null;
    this.setCurrentUser(null);
    this.loggedInSubject.next(false);
  }

  signUp(signupForm: { username: string, password: string, email: string }): Observable<User> {
    const user = {
      username: signupForm.username,
      email: signupForm.email,
      password: signupForm.password,
    };

    return this.http.post<User>(`${environment.apiUrl}/auth/signup`, user).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  logInForm(loginForm: { email: string, password: string }): Observable<User> {
    const user = {
      email: loginForm.email,
      password: loginForm.password
    };

    return this.http.post<User>(`${environment.apiUrl}/auth/login`, user).pipe(
      tap((response: User) => {
        if (response && response.token) {
          this.setToken(response.token, response.username);
          localStorage.setItem('username', response.username)
          this.currentUser = response;
          this.login();
          this.setCurrentUser(response);
          this.loggedInSubject.next(true);
        }
      }),
      catchError(error => {
        throw error;
      })
    );
  }
  
}
