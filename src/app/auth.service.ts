import { User } from './User';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentDate: Date = new Date();
  constructor() { }
  public login(id: any) {
    localStorage.setItem('ACCESS_TOKEN', (id).toString());
  }
  public isLoggedIn() {
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }
  public logout() {
    localStorage.removeItem('ACCESS_TOKEN');
  }
}
