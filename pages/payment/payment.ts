import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Member } from '../../models/interfaces/member.model';
import { Payment } from '../../models/interfaces/payment.model';
import { PaymentAddPage } from '../../pages/payment/payment_add';
import { PaymentViewPage } from '../../pages/payment/payment_view';
import { PrivilegeRole } from '../../models/interfaces/privilegerole.model';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})

export class PaymentPage {
  public static readonly PAYMENT_PY_ADD_ACCESS = 'addPayment';
  public static readonly PAYMENT_PY_VIEW_ACCESS = 'viewPayment';
  hasAddPaymentAccess: boolean = false;
  hasViewPaymentAccess: boolean = false;
  showLOA: boolean = false;
  showRegular: boolean = true;
  showResigned: boolean = false;
  payment_LOA = [];
  payment_Regular = [];
  payment_Resigned = [];
  payment = [];
  paymenttype = [];
  t = [];
  member$: any;
  privilegerole$: Observable<PrivilegeRole[]>
  member: Member;
  tmpSearchObject;
  tmpSearchObject_LOA;
  tmpSearchObject_Regular;
  tmpSearchObject_Resigned;
  co_id;
  constructor(public authService: AuthService, public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,
    private db: DbserviceProvider
  ) {
    console.log('PaymentPage constructor');
  }

  ngOnInit() {
    console.log('PaymentPage ngOnInit');


    this.db.col$$('committee', ref => ref.where('co_active', '==', true)).take(1).subscribe(comm => {
      // this.committee = comm[0].co_id;
      this.co_id = comm[0].co_id;


      this.db.col$$('member', ref => ref.where('mb_status', '==', 'LOA').orderBy('mb_hashname', 'asc')).subscribe(mbr => {
        mbr.map(mb => {
          this.payment_LOA[mb.mb_hashname] = [];
          this.payment_LOA[mb.mb_hashname]['mb_photo'] = mb.mb_photo;
          this.payment_LOA[mb.mb_hashname]['mb_status'] = mb.mb_status;
          this.db.col$$('payment', ref => ref.where('mb_hashname', '==', mb.mb_hashname).where('co_id', '==', this.co_id)).subscribe(x => {
            x.map(y => {
              this.payment_LOA[y.mb_hashname][y.py_type + 'id'] = y.id;
              this.payment_LOA[y.mb_hashname][y.py_type] = y.py_amount;
            })
          }
          )
        })
      });

      this.db.col$$('member', ref => ref.where('mb_status', '==', 'Regular Member').orderBy('mb_hashname', 'asc')).subscribe(mbr => {
        mbr.map(mb => {
          this.payment_Regular[mb.mb_hashname] = [];
          this.payment_Regular[mb.mb_hashname]['mb_photo'] = mb.mb_photo;
          this.payment_Regular[mb.mb_hashname]['mb_status'] = mb.mb_status;
          this.db.col$$('payment', ref => ref.where('mb_hashname', '==', mb.mb_hashname).where('co_id', '==', this.co_id)).subscribe(x => {
            x.map(y => {
              this.payment_Regular[y.mb_hashname][y.py_type + 'id'] = y.id;
              this.payment_Regular[y.mb_hashname][y.py_type] = y.py_amount;
            })
          }
          )
        })
      });


      this.db.col$$('member', ref => ref.where('mb_status', '==', 'Resigned').orderBy('mb_hashname', 'asc')).subscribe(mbr => {
        mbr.map(mb => {
          this.payment_Resigned[mb.mb_hashname] = [];
          this.payment_Resigned[mb.mb_hashname]['mb_photo'] = mb.mb_photo;
          this.payment_Resigned[mb.mb_hashname]['mb_status'] = mb.mb_status;
          this.db.col$$('payment', ref => ref.where('mb_hashname', '==', mb.mb_hashname).where('co_id', '==', this.co_id)).subscribe(x => {
            x.map(y => {
              this.payment_Resigned[y.mb_hashname][y.py_type + 'id'] = y.id;
              this.payment_Resigned[y.mb_hashname][y.py_type] = y.py_amount;

            })
          }
          )
        })
      });
    });

    this.db.col$$('paymenttype', ref => ref.orderBy('py_type', 'asc')).take(1).subscribe(pt => { pt.map(yy => { this.paymenttype.push(yy.py_type) }) });
    this.privilegerole$ = this.db.col$$('privilegerole');
  }

  ngOnDestroy() {
    console.log('PaymentPage ngOnDestroy');
  }

  ionViewDidLoad() {
    console.log('PaymentPage ionViewDidLoad');
    this.tmpSearchObject = this.payment_Regular;
    this.tmpSearchObject_LOA = this.payment_LOA;
    this.tmpSearchObject_Regular = this.payment_Regular;
    this.tmpSearchObject_Resigned = this.payment_Resigned;

    if (this.authService.currentUser) {
      this.authService.currentUser.subscribe(
        user => {
          this.db.hasAccess(user.ro_name, PaymentPage.PAYMENT_PY_ADD_ACCESS).subscribe(
            hasAddPaymentAccess => { this.hasAddPaymentAccess = hasAddPaymentAccess; });

          this.db.hasAccess(user.ro_name, PaymentPage.PAYMENT_PY_VIEW_ACCESS).subscribe(
            hasViewPaymentAccess => { this.hasViewPaymentAccess = hasViewPaymentAccess; });

        }
      )
    }
  }

  addPayment() {
    console.log('PaymentPage addPayment');
    this.navCtrl.push(PaymentAddPage, { co_id: this.co_id });
  }

  viewPayment(payment: Payment) {
    console.log('PaymentPage viewPledge');
    this.navCtrl.push(PaymentViewPage, {
      payment: payment
    });
  }

  deletePayment(id: any) {
    console.log('PaymentPage deletePayment');
    this.db.delete('payment', id);
  }

  search(searchbar, mb_status, status_type) {


    console.log('PaymentPage searchbar');
    var q = searchbar.target.value;

    if (q.trim() === '') {
      if (status_type === 'Regular') {
        this.payment_Regular = this.tmpSearchObject_Regular;
      }
      else if (status_type === 'Resigned') {
        this.payment_Resigned = this.tmpSearchObject_Resigned;
      }
      else {
        this.payment_LOA = this.tmpSearchObject_LOA;
      }
      return;
    }

    var selected = [];
    Object.keys(mb_status).filter(key => key.toLowerCase().indexOf(searchbar.target.value.toLowerCase()) > -1).map(i => selected[i] = mb_status[i]);

    if (status_type === 'Regular') {
      this.payment_Regular = selected;
    }
    else if (status_type === 'Resigned') {
      this.payment_Resigned = selected;
    }
    else {
      this.payment_LOA = selected;
    }
  }


  showConfirm(title: string, message: string): boolean {
    let ret = false;
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            ret = true;
          }
        },
        {
          text: 'No',
          handler: () => {
            confirm.dismiss();
            ret = false;
          }
        }
      ]
    });
    confirm.present();
    return ret;
  }
  toggleLOA() {
    if (this.showLOA == true) { this.showLOA = false } else { this.showLOA = true };
  }
  toggleRegular() {
    if (this.showRegular == true) { this.showRegular = false } else { this.showRegular = true };
  }
  toggleResigned() {
    if (this.showResigned == true) { this.showResigned = false } else { this.showResigned = true };
  }
}
