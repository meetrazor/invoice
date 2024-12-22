import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  // Register
  register(email: string, password: string): any {
    return this.http.post(`${this.apiUrl}/user/register`, { email, password });
  }

  // Login
  login(email: string, password: string): any {
    return this.http.post(`${this.apiUrl}/user/login`, { email, password });
  }

  // Logout
  logout() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http
        .post(
          `${this.apiUrl}/user/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .subscribe(() => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        });
    }
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
