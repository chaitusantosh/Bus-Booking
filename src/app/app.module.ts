import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { BusComponent } from './bus/bus.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SeatsComponent } from './seats/seats.component';
import { PaymentComponent } from './payment/payment.component';
import { QRCodeModule } from 'angularx-qrcode';
// import { NgxQRCodeModule } from 'ngx-qrcode2';
// import { PaymentComponent } from './payment/payment.component';


@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    BusComponent,
    SignInComponent,
    SeatsComponent,
    PaymentComponent
    // PaymentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    QRCodeModule,


    //--- NgxQRCodeModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
