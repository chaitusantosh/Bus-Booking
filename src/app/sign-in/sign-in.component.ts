import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { UserService } from './../user.service';
import { User } from './../User';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  providers: [UserService]
})
export class SignInComponent implements OnInit {
  public response: User[];
  access: number = 0;
  name: string;
  email: string;
  mobile: string;
  password: string;
  dateofbirth: string;
  sex: string
  constructor(public service: UserService, private router: Router, private authService: AuthService) { }

  signin() {
    if (this.name == null && this.password == null) {   //Name and password must not be empty
      this.access = 1;
    }
    else {
      this.service.getUsers().subscribe((data: Data) => {
        console.log(data.user);
        var y = data.user.find((user: any) => (user.name === this.name && user.password === this.password))//Name and password Checking If true y will be true
        if (y) {
          // let account = { name: this.name, email: this.email, mobile: this.mobile, password: this.password, dateofbirth: this.dateofbirth, sex: this.sex }
          for (let x of data.user) {
            if (x.name === this.name && x.password === this.password) {
              console.log(x._id);
              this.authService.login(x._id);//Generating access token based on User's _id generated in database
            }
          }

          this.access = 0;
          alert(`Signed in Successfully
Plan Your Wonderful Journey with BlueBus`);
          this.router.navigateByUrl('/bus');//Navigate to Plan Journey
          this.name = "";
          this.password = "";
        }
        else { //If name and Password does not match - Error
          this.access = 2;
          // alert('Invalid name or password');
          this.name = "";
          this.password = "";

        }

      })
    }

  }
  ngOnInit(): void {
  }

}
 // this.response = data.user
      // if (data.find(this.name)) {
      //   console.log('there')
      // }
      // for (let user of data.user) {

      // if (user.name !== this.name) {
      //   console.log('username not match')
      //   // this.router.navigateByUrl('/bus');
      // }
      // else {
      //   console.log('does match');
      // }
      // }
