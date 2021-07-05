import { Data } from '@angular/router';
import { UserService } from './../user.service';
import { User } from './../User';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [UserService]
})
export class SignUpComponent implements OnInit {
  // public response: User[];
  name: string;
  email: string;
  mobile: string;
  password: string;
  dateofbirth: string;
  sex: string;

  constructor(public service: UserService, private router: Router) {
  }
  // get() {
  //   this.service.getUsers().subscribe((data: Data) => {
  //     console.log(data);
  //     this.response = data.user
  //   })
  // }
  adduser() {
    // console.log(typeof this.dateofbirth)
    const newUser = { name: this.name, email: this.email, mobile: this.mobile, password: this.password, dateofbirth: this.dateofbirth, sex: this.sex }

    this.service.getUsers().subscribe((data: Data) => {

      //Checking if user already exists with same name password and date of birth

      var y = data.user.find((user: any) => (user.name === this.name && user.password === this.password && user.dateofbirth === this.dateofbirth))
      if (!y) {
        this.service.postUsers(newUser).subscribe(data => {
          alert(`Account Created Successfully
Please Sign In`);
          this.router.navigateByUrl('');
        })
      }
      else {
        alert('User already exists! Please Sign In');
        this.router.navigateByUrl('');
      }

    })
  }



  ngOnInit(): void {
  }

}
