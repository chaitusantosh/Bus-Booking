import { BusComponent } from './../bus/bus.component';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, Data } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-seats',
  templateUrl: './seats.component.html',
  styleUrls: ['./seats.component.css'],
  providers: [BusComponent]
})
export class SeatsComponent implements OnInit {
  // @Input() selected_bus: any;
  coupon: string;
  promoapplied = 0;
  selected_bus: any;
  public busseat: any;
  count = 0;
  current_user: any;
  Discount: string;
  passengers: { [keys: string]: string } = {};
  passenger_details: any;
  promo_error: number;
  constructor(private bus: BusComponent, private router: Router, private service: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.selected_bus = JSON.parse(this.route.snapshot.queryParamMap.get('selected_bus_details')!);
    this.current_user = localStorage.getItem('ACCESS_TOKEN');

    this.service.getBus().subscribe((data: Data) => {
      this.busseat = [];
      for (let x of data.bus) {
        if (x.from === this.selected_bus.from && x.to === this.selected_bus.to && x.date == this.selected_bus.date && x.type === this.selected_bus.type)
          this.busseat.push(x.bookedseats)
      }
      console.log(this.busseat);

      // for (let i = 0; i < this.busseat[0].length; i++) {
      //   var cell = document.getElementById(this.busseat[0][i]);
      //   console.log(Number(cell?.id));
      //   if (Number(cell?.id) % 2 === 0)
      //     cell!.className = "black down";
      //   else
      //     cell!.className = "black"
      // }
    })

  }
  Numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
  selectedseat: number[] = [];
  promo() {
    console.log(typeof (this.current_user));
    if (this.coupon === "WELCOME2BB") {
      this.service.getUsers().subscribe((data: Data) => {
        var user = data.user.find((user: any) => user._id === this.current_user)
        console.log(user);
        if (user.plan.length === 0) {
          this.promoapplied = 1;
          this.Discount = "WELCOME2BB";
        }
        else {
          this.promo_error = 1;
        }
      })
    }
    else if (this.coupon === "FABFIVE") {
      if (this.count >= 5) {
        this.promoapplied = 2;
        console.log("HERE2");
        this.Discount = "FABFIVE";
      }
      else {
        this.promo_error = 2;
      }

    } else {
      this.promoapplied = 0;
      this.Discount = "";
    }
  }
  clickSeat(event: Event) {
    console.log(this.selected_bus);

    // this.service.getBus().subscribe((data: Data) => {
    //   this.busseat = [];
    //   // for (let x of data.bus) {
    //   //   if (x.from === this.selected_bus.from && x.to === this.selected_bus.to && x.date == this.selected_bus.date && x.type === this.selected_bus.type)
    //   //     this.busseat.push(x.bookedseats)
    //   // }
    //   console.log(this.busseat[0]);
    //   for (let i = 0; i < this.busseat.length; i++) {
    //     if (this.busseat[i] == (<HTMLElement>event.target).id) {
    //       var cell = document.getElementById((<HTMLElement>event.target).id);
    //       document.getElementById((<HTMLElement>event.target).id)?.style.pointerEvents;
    //       cell!.className = "black";
    //     }
    //   }
    //   // console.log(document.getElementById(event));
    // })
    // document.getElementById('el').classList.add('success');
    var cell = document.getElementById((<HTMLElement>event.target).id);
    //event.preventDefault();
    //var cell_element = <HTMLElement>event.target;
    //var cell = document.getElementById(cell_element.closest("td")?.getAttribute("id")!);
    console.log(cell);
    console.log(typeof ((<HTMLElement>event.target).id));
    if (cell?.className.includes("success")) {
      // if (cell?.className.includes("down")) {
      //   cell.className = "down fail";

      // }
      // else {
      //   cell.className = "fail";
      // }

      this.count--;
      let x = parseInt((<HTMLElement>event.target).id);

      var index = this.selectedseat.indexOf(x);
      if (index !== -1) {
        this.selectedseat.splice(index, 1);
      }
      delete this.passengers[x];

      console.log(this.selectedseat);

    }
    else {
      if (cell) {
        console.log(cell.className);
        // if (cell?.className.includes("down")) {
        //   cell.className = "down success";
        // }
        // else {
        //   cell.className = "success";
        // }
        this.count++;
        let x = parseInt((<HTMLElement>event.target).id);
        //let x = parseInt((<HTMLElement>event.target).id) || parseInt(cell_element.closest("td")?.getAttribute("id")!);
        console.log(typeof (x));
        this.selectedseat.push(x);
        for (let key of this.selectedseat) {
          console.log(key);
          this.passengers[key] = "";
          console.log(this.passengers);
        }

      }
      // this.selectedseat.push(parseInt((<HTMLElement>event.target).id));
      console.log(this.selectedseat);
    }


    // console.log(this.selectedseat);
  }
  payment(total_amount: number) {
    console.log(this.coupon);
    if (this.Discount === "WELCOME2BB") {
      total_amount -= (total_amount * (15 / 100));
    } else if (this.Discount === "FABFIVE") {
      total_amount -= (total_amount * (10 / 100));
    }
    else {
      total_amount;
    }
    var r = confirm(`Are you sure you want to Proceed?
Once you are in the payment page do not Refresh`)
    if (r) {
      this.passenger_details = { from: this.selected_bus.from, to: this.selected_bus.to, date: this.selected_bus.date, type: this.selected_bus.type, fare: total_amount, seats: this.selected_bus.seats, departure: this.selected_bus.departure, arrival: this.selected_bus.arrival, selectedseat: this.selectedseat, passengers: this.passengers };
      console.log(this.passenger_details)
      let holdseats = JSON.stringify(this.passenger_details);
      this.router.navigate(['/payment'], { queryParams: { seats_held: holdseats } });
    }

  }

}
