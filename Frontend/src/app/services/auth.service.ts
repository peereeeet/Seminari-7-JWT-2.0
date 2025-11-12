import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  _id: string;
  username: string;
  gmail: string;
  birthday: Date;
  eventos: string[];
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Verificar si hay un usuario en localStorage al inicializar
    const savedUser = localStorage.getItem('currentUser');
  if (savedUser && savedUser !== 'undefined') {
  try {
    this.currentUserSubject.next(JSON.parse(savedUser));
  } catch (e) {
    console.error('Error parsing saved user:', e);
    localStorage.removeItem('currentUser'); // Eliminar si está corrupto
  }
}

  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/user/login`, {username, password}).pipe(
      tap(response => {
        const userData = (response as any).User;
        if (userData) {
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken',response.refreshToken);
          this.currentUserSubject.next(userData);

        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Método para crear admin (solo desarrollo)
  createAdminUser(): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/auth/create-admin`, {});
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    const currentUser = localStorage.getItem('currentUser');
    if (!refreshToken || !currentUser) {
      throw new Error('No refresh token or current user found');
    }
    const user = JSON.parse(currentUser);
    return this.http.post(`${this.apiUrl}/user/refresh`, { refreshToken, userId: user._id });
  }
}