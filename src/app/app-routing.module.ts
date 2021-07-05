import { AuthguardGuard } from './authguard.guard';
import { SignInComponent } from './sign-in/sign-in.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusComponent } from './bus/bus.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SeatsComponent } from './seats/seats.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'signin' },
  { path: 'bus', component: BusComponent, canActivate: [AuthguardGuard] },
  { path: 'signin/signup', component: SignUpComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'seats', component: SeatsComponent, canActivate: [AuthguardGuard] },
  { path: 'payment', component: PaymentComponent, canActivate: [AuthguardGuard] },
  // { path: '', component: PaymentComponent, canDeactivate: [AuthguardGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
