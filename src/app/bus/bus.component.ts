import { Bus } from './../Bus';
import { Data } from '@angular/router';
import { BusType } from './../busType';
import { UserService } from './../user.service';
import { Component, Inject, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.css'],
  providers: [UserService]
})
export class BusComponent implements OnInit {
  // seat: number = 0;
  currentDate: Date = new Date();
  set: number;
  from: string;
  to: string;
  date: string;
  journey_details: Object;
  curr_user_id: any;
  disable_locations: boolean;
  bookings_boolean: boolean;
  coupon: boolean;

  // Number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]

  constructor(private router: Router, private authService: AuthService, private service: UserService, @Inject(DOCUMENT) document: any) { }
  locations = ['Amravati', 'Itanagar', 'Dispur', 'Patna', 'Atal Nagar', 'Panaji', 'GandhiNagar', 'Chandigarh', 'Shimla', 'Ranchi', 'Thiruvananthapuram', 'Bhopal', 'Mumbai', 'Imphal', 'Shillong', 'Aizwal', 'Kohima', 'Bhubaneshwar', 'Jaipur', 'Gangtok', 'Agartala', 'Lucknow', 'Dehradun', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad', 'Delhi', 'Srinagar',];
  public plans: any[];
  // seats_numbers: any[];
  // passenger_names: any[];
  public buses: BusType[];
  title: any;
  public buses_available: Bus[];
  ngOnInit(): void {
    this.curr_user_id = localStorage.getItem('ACCESS_TOKEN');
    this.service.getUsers().subscribe((data: Data) => {
      for (let bus_user of data.user) {
        if (bus_user._id === this.curr_user_id)
          this.title = bus_user.name;
      }
    })
  }

  logout() {
    this.authService.logout();//Loagout and removing accesstoken
    this.router.navigateByUrl('');
  }
  bookings() {
    this.bookings_boolean = !this.bookings_boolean;
    this.curr_user_id = localStorage.getItem('ACCESS_TOKEN');
    console.log(this.curr_user_id);//getting details of user plans by access token(user._id)
    // this.curr_user_id = String(this.curr_user_id).replace(this.currentDate.getDate().toString(), "");
    // console.log('hello!', this.curr_user_id)
    this.service.getUsers().subscribe((data: Data) => {
      for (let bus_user of data.user) {
        // console.log(x._id);
        // console.log('hi', this.curr_user_id)

        //this.seats_numbers = [];
        //this.passenger_names = [];
        if (bus_user._id === this.curr_user_id) {//if the id matches the id in data base bookings will be visible
          this.plans = bus_user.plan;
          console.log(this.plans);
          // for (let y of this.plans) {
          //   console.log(Object.keys(y.passengers))
          //   this.seats_numbers.push(Object.keys(y.passengers))
          //   console.log(Object.values(y.passengers))
          //   this.passenger_names.push(Object.values(y.passengers))
          // }
          // this.user_plans.push(y.passengers)
          // this.seats_numbers = this.seats_numbers.reduce((acc, val) => acc.concat(val), []);
          // this.passenger_names = this.passenger_names.reduce((acc, val) => acc.concat(val), []);
          // console.log(this.seats_numbers.reduce((acc, val) => acc.concat(val), []))
          // console.log(this.passenger_names)
          //   console.log(y.passengers)
          //   this.user_plans = {...this.user_plans, ...y.passengers}
          // }
          // console.log(this.user_plans);
        }
      }
    });
  }
  bus() {
    console.log(this.date);
    this.bookings_boolean = false;
    console.log(this.date, typeof (this.date));
    if (this.from === this.to) {
      alert('select different source or destination')
    }

    else if (this.date === undefined || this.date === "") {
      alert('Please select date');
    }


    else {
      this.service.getBus().subscribe((data: Data) => {
        var y = data.bus.find((bus: any) => (bus.from === this.from && bus.to === this.to && bus.date === this.date))//Searching in Bus database whether buses are available on the same date with corresponding from and to
        if (!y) {
          this.set = 1;
          this.service.getBusTypes().subscribe((data: Data) => {//If bus is not available displaying bus type and posting it to Bus database
            this.buses = data.bustype;
            console.log(this.buses);
            for (let bus of (this.buses)) {
              console.log(bus.type)
              const newBus = { from: this.from, to: this.to, date: this.date, type: bus.type, seats: bus.seats, fare: bus.fare, departure: bus.departure, arrival: bus.arrival, booked: 0, available: 40, bookedseats: [] }
              this.service.postBus(newBus).subscribe();
              console.log(this.from, this.to, this.date);
            }
          })
        }
        else {
          this.set = 2;
          this.service.getBus().subscribe((data: Data) => {
            this.buses_available = [];
            for (let bus_available of data.bus) {
              if (bus_available.from === this.from && bus_available.to === this.to && bus_available.date === this.date) {
                this.buses_available.push(bus_available);
              }
            }
            console.log(this.buses_available)
          })
        }
        this.disable_locations = true;

        // this.buses = data.bustype;
        // for (let x of (this.buses)) {
        //   console.log(x.type);
        // }
        // this.buses = data.bustype;
      })

    }

  }
  edit() {
    this.disable_locations = false;
  }
  clear_locations() {
    this.from = "";
    this.to = "";
    this.date = "";
    this.disable_locations = false;
    this.set = 0;
  }
  coupons() {
    this.coupon = !this.coupon;
  }







  seats(selected_bus: any) {
    this.set = 3;
    this.journey_details = {
      from: this.from, to: this.to, date: this.date, type: selected_bus.type, fare: selected_bus.fare,
      seats: selected_bus.seats, departure: selected_bus.departure, arrival: selected_bus.arrival
    }

    this.router.navigate(['/seats'], { queryParams: { selected_bus_details: JSON.stringify(this.journey_details) } });
  }

}
