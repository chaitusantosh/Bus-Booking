import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Data, NavigationStart, Router } from '@angular/router';
import { SeatsComponent } from '../seats/seats.component';
import { UserService } from '../user.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { browserRefresh } from '../app.component';



@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  providers: [SeatsComponent]
})
export class PaymentComponent implements OnInit {
  // @Input() passenger_details: any;
  // public myAngularxQrCode: number;
  // elementType: any;
  // value: any;
  public qrdata: string;

  card_number: any;
  card_name: any;
  card_cvv: any;
  expiry_date: any;
  card_Type: any;
  passenger_details: any;
  curr_user_id: any;
  // cardType: any;
  currentDate: Date = new Date();
  doc = new jsPDF()
  names: Array<Array<string>> = [];
  seats: string[] = [];
  tran_id: number;
  browserRefresh: boolean;
  constructor(public service: UserService, private router: Router, private route: ActivatedRoute) {
    router.events
      .subscribe((event: any) => {
        if (event.navigationTrigger === 'popstate') {
          var r = confirm(`If you click OK you will be redirected to Home page
If you click cancel you will be redirected to select seats`)
          if (r) {
            this.router.navigate(['/bus'])
          }
          else {
            return null
          }

        }
      });
  }

  ngOnInit() {
    this.browserRefresh = browserRefresh;
    if (browserRefresh) {
      this.router.navigate(['/bus']);
    }
    this.passenger_details = JSON.parse(this.route.snapshot.queryParamMap.get('seats_held')!);
    console.log(this.passenger_details);
    this.tran_id = Math.floor(Math.random() * (999999999 - 100000000) + 100000000);
    let final_payment = { passengers: this.passenger_details, tran_id: this.tran_id }
    this.qrdata = JSON.stringify(final_payment);

  }
  paynow() {
    alert(`Payment Successful, Your Ticket will be downloaded in a second.
Have a Safe Journey!!
Thank You for booking with BlueBus!
`)
    this.service.getBus().subscribe((data: Data) => {
      for (let x of data.bus) {
        if (x.from === this.passenger_details.from && x.to === this.passenger_details.to && x.date === this.passenger_details.date && x.type === this.passenger_details.type) {
          console.log(this.passenger_details.selectedseat)
          for (let i of this.passenger_details.selectedseat) {
            x.bookedseats.push(i)
          }
          x.booked += this.passenger_details.selectedseat.length;
          x.available -= this.passenger_details.selectedseat.length;
          console.log(this.passenger_details.selectedseat.length);
          console.log(x);
          const body = x
          console.log(body);
          this.service.putBus(body)
            .subscribe();
        }
      }
    })



    this.curr_user_id = localStorage.getItem('ACCESS_TOKEN');
    // this.curr_user_id = String(this.curr_user_id).replace(this.currentDate.getDate().toString(), "");
    console.log(this.curr_user_id);
    // this.service.getBus().subscribe((data: Data) => {
    //   for (let y of data.bus) {
    //     if (this.passenger_details.from === y.from && this.passenger_details.to === y.to && this.passenger_details.date === y.date) {
    //       this.service.getUsers().subscribe((data: Data) => {
    //         for (let x of data.user) {
    //           if (x._id === this.curr_user_id) {
    //             console.log(x.plan.from)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
    this.service.getUsers().subscribe((data: Data) => {
      for (let x of data.user) {
        if (x._id === this.curr_user_id) {
          console.log(this.curr_user_id, x._id);
          // this.service.getBus().subscribe((data: Data) => {
          //   for (let y of data.bus) {
          //     if (this.passenger_details.from === y.from && this.passenger_details.to === y.to && this.passenger_details.date === y.date) {
          //       // console.log(this.passenger_details.passengers)
          //       const change = { passengers: this.passenger_details.passengers }
          //       x.plan[0].passengers.push(change);
          //       console.log(x.plan[0].passengers)
          //       // x.plan.passengers.push(this.passenger_details.passengers)

          //     }
          //   }
          // })

          const plan = { from: this.passenger_details.from, to: this.passenger_details.to, passengers: this.passenger_details.passengers, date: this.passenger_details.date }
          x.plan.push(plan)
          console.log(x);
          this.service.putUser(x).subscribe();
          // console.log(x.plan[0].passengers);
        }
      }
    })
    // this.value = this.tran_id;

    var col = ["Passenger Name", "Seat. No"];
    for (let x in this.passenger_details.passengers) {
      var temp: Array<string> = [this.passenger_details.passengers[x], x];
      this.names.push(temp);
      console.log(temp);
    };
    console.log(this.names)

    // this.doc.addImage()
    // this.doc.addImage(img, 'png');

    // var img = new Image();
    // img.src = 'D:\Training Project\Bus-Booking\src\app\logo.jpg';
    // this.myAngularxQrCode = this.tran_id;

    // var source = window.document.getElementsByTagName("qrcode")[0];
    // this.doc.html(source, 15)
    // console.log(window.document.getElementsByTagName("qrcode")[0]);
    // this.doc.addImage();
    var c = document.getElementsByTagName("canvas")[0];
    var ctx = c.toDataURL().toString();
    console.log(ctx);
    // var canvas = document.createElement("canvas");
    // let context = canvas.getContext('2d');
    // this.doc.addImage(canvas.toDataURL('logo.jpg'), 'PNG', 0, 0, 200, 50);
    this.doc.addImage(window.document.getElementsByTagName("img")[1], 'PNG', 0, 0, 220, 30);
    this.doc.addImage(window.document.getElementsByTagName("img")[2], 'PNG', 0, 240, 210, 60);

    this.doc.addImage(ctx, 'JPEG', 15, 34, 30, 30);
    this.doc.text("Please don't take a print of this, show this QR code Instead!", 50, 45);
    this.doc.text("Save Paper! Save Trees!", 85, 55);

    autoTable(this.doc, {
      head: [['From', 'To', 'Date', 'Departure', 'Arrival', 'Bus Type']],
      body: [
        [this.passenger_details.from, this.passenger_details.to, this.passenger_details.date, this.passenger_details.departure, this.passenger_details.arrival, this.passenger_details.type],
      ], startY: 70
    })
    autoTable(this.doc, { head: [col], body: this.names, startY: 100 })
    // var string = this.doc.output('datauristring');
    // var embed = "<embed width='100%' height='100%' src='" + string + "'/>"
    //document.open();
    // document.write(embed);
    // document.close();
    this.doc.save('Ticket.pdf')

    this.router.navigateByUrl('/bus');
  }
}
