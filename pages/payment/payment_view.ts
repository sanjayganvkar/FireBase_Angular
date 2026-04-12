import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { PaymentPage } from '../../pages/payment/payment';
import { PaymentUpdatePage } from '../../pages/payment/payment_update';

@Component({
  selector: 'page-payment_view',
  templateUrl: 'payment_view.html',
})
export class PaymentViewPage {
  public static readonly PAYMENT_PY_UPD_ACCESS = 'updatePayment';
  public static readonly PAYMENT_PY_DEL_ACCESS = 'deletePayment';

  hasUpdPaymentAccess: boolean = false;
  hasDelPaymentAccess: boolean = false;

  payment: any;
  id: string;
  mb_hashname: string;
  mb_photo: string;
  mb_status: string;
  py_date: string;
  py_type: string;
  py_description: string;
  py_amount: string;

  constructor(private authService: AuthService, public navCtrl: NavController, public navParams: NavParams
    , public alertCtrl: AlertController, private db: DbserviceProvider
  ) {
    console.log('PaymentViewPage constructor');
  }

  ionViewDidLoad() {
    console.log('PaymentViewPage ionViewDidLoad');
    this.id = this.navParams.get('payment').id;
    this.payment = this.db.doc$('payment/' + this.id);
    if (this.authService.currentUser) {
      this.authService.currentUser.subscribe(
        user => {
          this.db.hasAccess(user.ro_name, PaymentViewPage.PAYMENT_PY_UPD_ACCESS).subscribe(
            hasUpdPaymentAccess => { this.hasUpdPaymentAccess = hasUpdPaymentAccess; });
        }
      )
      this.authService.currentUser.subscribe(
        user => {
          this.db.hasAccess(user.ro_name, PaymentViewPage.PAYMENT_PY_DEL_ACCESS).subscribe(
            hasDelPaymentAccess => { this.hasDelPaymentAccess = hasDelPaymentAccess; });
        }
      )
    }
  }

  ngOnDestroy() {
    console.log('PaymentViewPage ngOnDestroy');
    //this.navCtrl.push(PaymentPage);
  }
  deletePayment(id: any) {
    console.log('PaymentViewPage deletePayment');
    this.showConfirm("Payment", "Do you want to delete the Payment?", id);
  }
  updatePayment(id: any) {

    console.log('PaymentViewPage updatePayment');

    const formValues: any = {
      id: this.id,
      mb_hashname: this.mb_hashname,
      mb_photo: this.mb_photo,
      mb_status: this.mb_status,
      py_date: this.py_date,
      py_type: this.py_type,
      py_description: this.py_description,
      py_amount: this.py_amount
    }
    console.log(formValues);
    this.navCtrl.push(PaymentUpdatePage, {
      payment: formValues
    });
  }

  showConfirm(title: string, message: string, id: string) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.db.delete('payment', id);
            this.navCtrl.setRoot(PaymentPage);
          }
        },
        {
          text: 'No',
          handler: () => {

          }
        }
      ]
    });
    confirm.present();
  }
}
