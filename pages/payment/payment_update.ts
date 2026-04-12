import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { PaymentPage } from '../../pages/payment/payment';
import { PaymentType } from '../../models/interfaces/paymenttype.model';
import { Payment } from '../../models/interfaces/payment.model';

@Component({
  selector: 'page-payment_update',
  templateUrl: 'payment_update.html',
})
export class PaymentUpdatePage {
  paymenttype$: Observable<PaymentType[]>;
  payment: any;
  id: string;
  mb_hashname: string;
  mb_photo: string;
  mb_status: string;
  py_date: string;
  py_type: string;
  py_amount: number;
  py_description: string;
  paymentForm: FormGroup;
  pType;


  //https://stackoverflow.com/questions/46686618/angular-formbuilder-how-to-avoid-duplication-of-data
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private db: DbserviceProvider
  ) {
    console.log('PaymentUpdatePage constructor');
  }
  ngOnDestroy() {
    console.log('PaymentUpdatePage ngOnDestroy');
    this.paymenttype$ = null;
  }
  ionViewDidLoad() {
    console.log('PaymentUpdatePage ionViewDidLoad');
    this.paymenttype$ = this.db.col$$('paymenttype', ref => ref.orderBy('py_type'));

    this.id = this.navParams.get('id');

    this.payment = this.db.doc$<Payment>('payment/' + this.id).take(1).subscribe
      (py => {

        this.mb_hashname = py.mb_hashname;
        console.log('PaymentUpdatePage mb_hashname', this.mb_hashname);
        this.mb_photo = py.mb_photo;
        this.mb_status = py.mb_status;
        this.py_date = py.py_date;
        this.py_type = py.py_type;
        this.py_description = py.py_description;
        this.py_amount = py.py_amount;
        this.paymentForm = this.formBuilder.group({
          mb_hashname: [this.mb_hashname],
          mb_photo: [this.mb_photo],
          mb_status: [this.mb_status],
          py_date: [this.py_date],
          py_type: [this.py_type],
          py_description: [this.py_description],
          py_amount: [this.py_amount]
        });

        this.pType = this.paymentForm.value;
      }
      )
      ;
  }

  goback() {
    console.log('PaymentUpdatePage goback');
    this.navCtrl.setRoot(PaymentPage);
  }

  updatePayment(id: string, value: any) {

    console.log('PaymentUpdatePage updatePayment');
    const formValues: any = {
      mb_hashname: value.mb_hashname,
      mb_photo: value.mb_photo,
      mb_status: value.mb_status,
      py_date: value.py_date,
      py_type: this.pType.py_type,
      py_description: value.py_description,
      py_amount: value.py_amount
    }
    console.error(formValues); console.error(value);
    this.db.update('payment', id, formValues);
    this.navCtrl.setRoot(PaymentPage);
  }

  deletePayment(id: any) {
    console.log('PaymentUpdatePage deletePayment');
    this.db.delete('payment', id);
    this.navCtrl.setRoot(PaymentPage);
  }
}
