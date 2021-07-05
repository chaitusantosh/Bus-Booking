import { Bus } from './Bus';
import { User } from './User';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: any;
  errorMessage: any;
  constructor(private http: HttpClient) { }
  public getUsers() {
    return this.http.get('http://localhost:8081/api/users');
  }
  public postUsers(user: User) {
    return this.http.post('http://localhost:8081/api/user', user)
  }
  public putUser(user: User) {
    return this.http.put('http://localhost:8081/api/user', user)
  }
  public getBusTypes() {
    return this.http.get('http://localhost:8081/api/bustypes');
  }
  public getBus() {
    return this.http.get('http://localhost:8081/api/bus');
  }
  public postBus(bus: Bus) {
    return this.http.post('http://localhost:8081/api/bus', bus);
  }
  public putBus(bus: Bus) {
    return this.http.put('http://localhost:8081/api/bus', bus);
  }

}
