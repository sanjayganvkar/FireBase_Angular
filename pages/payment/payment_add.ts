import { AlertController, LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ModalController } from 'ionic-angular';

import { ListComponent } from '../../components/listcomponent/listcomponent';
import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ValidationserviceProvider } from '../../providers/dbservice/validationservice';
import { Member } from '../../models/interfaces/member.model';
import { PaymentPage } from '../../pages/payment/payment';
import { PaymentType } from '../../models/interfaces/paymenttype.model';

@Component({
  selector: 'page-payment_add',
  templateUrl: 'payment_add.html',
})
export class PaymentAddPage {

  loading: any;
  paymenttype$: Observable<PaymentType[]>;
  paymentitem$: Observable<PaymentItem[]>;
  member$: Observable<Member[]>;
  memberForm: FormGroup;
  paymentForm: FormGroup;
  member: Member;
  py_date: string = new Date(new Date().getFullYear(), new Date().getMonth() , new Date().getDate() + 1).toISOString().substring(0, 10);
  pType;
  smember: string;
  smemberM: Member[];
  co_id;

  constructor(public authService: AuthService, public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private toastCtrl: ToastController
    , private db: DbserviceProvider, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, public modalCtrl: ModalController
  ) {
    console.log('PaymentAddPage constructor');

 
    this.co_id = this.navParams.get('co_id');
    this.paymentForm = this.formBuilder.group({
      mb_hashname: ['',[Validators.required]],
      mb_photo: [''],
      mb_status: [''],
      py_date: [this.py_date,[Validators.required]],
      py_type: ['',[Validators.required]],
      py_amount: [],
      py_description: [''],
    });
  }

  ionViewDidLoad() {
    console.log('PaymentAddPage ionViewDidLoad');
    this.member$ = this.db.col$$('member', ref => ref.orderBy('mb_hashname'));
    this.paymenttype$ = this.db.col$$('paymenttype', ref => ref.orderBy('py_type'));
  }

  selectMember(val) {
    console.log('PaymentAddPage selectMember');
    let selection = this.modalCtrl.create(ListComponent, { obs: 'member', sel: val, type: "S" });
    selection.present();
    selection.onDidDismiss(data => {
      if (data != null) {

        this.smemberM = data;
        this.smember = data.map(v => v.mb_hashname).toString();
      }
    });
  }

  goback() {
    console.log('PaymentAddPage goback');
    this.navCtrl.pop();
  }

  addPayment(value: any) {
    console.log('PaymentAddPage addPayment');
    const formValues: any = {
      mb_hashname: this.smemberM[0].mb_hashname,
      mb_photo: this.smemberM[0].mb_photo,
      mb_status: this.smemberM[0].mb_status,
      py_date: this.py_date,
      py_type: value.py_type.py_type,
      py_amount: value.py_amount,
      py_description:  value.py_description,
      co_id: this.co_id
    }

    this.db.add('payment', formValues);
    this.navCtrl.setRoot(PaymentPage);

  }

  ngOnDestroy() {
    console.log('PaymentAddPage ngOnDestroy');
    }
}
