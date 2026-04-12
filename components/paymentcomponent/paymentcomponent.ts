import { Component, Input } from '@angular/core';
import { AuthService } from '../../providers/dbservice/authservice';
import { NavController } from 'ionic-angular';
import { PaymentUpdatePage } from '../../pages/payment/payment_update';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
/**
 * Generated class for the PledgeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'paymentcomponent',
  templateUrl: 'paymentcomponent.html'
})
export class PaymentComponent {

  @Input() payment: any;
  @Input() paymenttype: any;
  @Input() displayPic: boolean;

  public static readonly PAYMENT_PY_ADD_ACCESS = 'addPayment';
  hasAddPaymentAccess: boolean = false;

  objectKeys = Object.keys;
  constructor(public authService: AuthService, public navCtrl: NavController, private db: DbserviceProvider) {
    console.log('PaymentComponent Component');
    if (this.authService.currentUser) {
      this.authService.currentUser.subscribe(
        user => {
          this.db.hasAccess(user.ro_name, PaymentComponent.PAYMENT_PY_ADD_ACCESS).subscribe(
            hasAddPaymentAccess => { this.hasAddPaymentAccess = hasAddPaymentAccess; 
            });
        }
      )
    }

  }

  ionViewDidLoad() {
    console.log('PaymentPage ionViewDidLoad');

    
    if (this.authService.currentUser) {
      this.authService.currentUser.subscribe(
        user => {
          this.db.hasAccess(user.ro_name, PaymentComponent.PAYMENT_PY_ADD_ACCESS).subscribe(
            hasAddPaymentAccess => { this.hasAddPaymentAccess = hasAddPaymentAccess; 
            });
        }
      )
    }
  }

  viewPayment(id: string) {
    console.log('PaymentComponent viewPayment ' + id );

    if (this.hasAddPaymentAccess) {
      this.navCtrl.push(PaymentUpdatePage, {
        id: id
      });
    }
  }

}
