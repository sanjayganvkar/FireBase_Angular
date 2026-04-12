import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Member } from '../../models/interfaces/member.model';
import { Pledge } from '../../models/interfaces/pledge.model';
import { PledgeAddPage } from '../../pages/pledge/pledge_add';
import { PledgeViewPage } from '../../pages/pledge/pledge_view';
import { PrivilegeRole } from '../../models/interfaces/privilegerole.model';

@Component({
  selector: 'page-pledge',
  templateUrl: 'pledge.html',
})


export class PledgePage {

  public static readonly PLEDGE_HL_ADD_ACCESS = 'addRunPledge';
  public static readonly PLEDGE_BD_ADD_ACCESS = 'addBirthdayPledge';
  page: string = 'pledge';
  hasAddRunPledgeAccess: boolean = false;
  hasAddBdayPledgeAccess: boolean = false;
  showPaid: boolean = false;
  showUnpaid: boolean = true;
  showWrittenOff: boolean = true;
  //  WrittenOff
  pledge_paid: any;
  pledge_unpaid: any;
  pledge_writtenoff: any;
  member$: any;
  privilegerole$: Observable<PrivilegeRole[]>
  member: Member;
  tmpSearchObject_Paid;
  tmpSearchObject_Unpaid;
  tmpSearchObject_WrittenOff;
  constructor(public authService: AuthService, public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,
    private db: DbserviceProvider
  ) {
    console.log('PledgePage constructor');
  }

  ngOnInit() {
    console.log('PledgePage ngOnInit');
    this.pledge_paid = this.db.col$$('pledge', ref => ref.where('pl_pymt_status', '==', 'Paid').orderBy('pl_date', 'desc'));
    this.pledge_unpaid = this.db.col$$('pledge', ref => ref.where('pl_pymt_status', '==', 'Unpaid').orderBy('pl_date', 'desc'));
    this.pledge_writtenoff = this.db.col$$('pledge', ref => ref.where('pl_pymt_status', '==', 'Written Off').orderBy('pl_date', 'desc'));
    this.privilegerole$ = this.db.col$$('privilegerole');

  }

  ngOnDestroy() {
    console.log('PledgePage ngOnDestroy');
    this.pledge_paid = null;
    this.pledge_unpaid = null;
    this.pledge_writtenoff = null;
  }

  ionViewDidLoad() {
    console.log('PledgePage ionViewDidLoad');
    this.tmpSearchObject_Paid = this.pledge_paid;
    this.tmpSearchObject_Unpaid = this.pledge_unpaid;
    this.tmpSearchObject_WrittenOff = this.pledge_writtenoff;
    if (this.authService.currentUser) {
      this.authService.currentUser.subscribe(
        user => {
          this.db.hasAccess(user.ro_name, PledgePage.PLEDGE_HL_ADD_ACCESS).subscribe(
            hasAddRunPledgeAccess => { this.hasAddRunPledgeAccess = hasAddRunPledgeAccess; });
        }
      )
      this.authService.currentUser.subscribe(
        user => {
          this.db.hasAccess(user.ro_name, PledgePage.PLEDGE_BD_ADD_ACCESS).subscribe(
            hasAddBdayPledgeAccess => { this.hasAddBdayPledgeAccess = hasAddBdayPledgeAccess; });
        }
      )
    }
  }

  addPledge() {
    console.log('PledgePage addPledge');
    this.navCtrl.push(PledgeAddPage);
  }

  viewPledge(pledge: Pledge) {
    console.log('PledgePage viewPledge');
    this.navCtrl.push(PledgeViewPage, {
      pledge: pledge
    });
  }

  deletePledge(id: any) {
    console.log('PledgePage deleteMember');
    this.db.delete('pledge', id);
  }

  search(searchbar, status_type) {
    console.log('PledgePage searchbar');
    var q = searchbar.target.value;

    if (q.trim() === '') {
      if (status_type === 'Unpaid') {
        this.pledge_unpaid = this.tmpSearchObject_Unpaid;
      }
      else if (status_type === 'WrittenOff'){
        this.pledge_writtenoff = this.tmpSearchObject_WrittenOff;
      }
      else {
        this.pledge_paid = this.tmpSearchObject_Paid;
      }
      return;
    }
    if (status_type === 'Unpaid') {
      this.pledge_unpaid = this.pledge_unpaid
        .map(arrays => arrays.filter(arrayEl => arrayEl.mb_hashname.toLowerCase().indexOf(searchbar.target.value.toLowerCase()) > -1
          || arrayEl.pl_pymt_status.toLowerCase().indexOf(searchbar.target.value.toLowerCase()) > -1));

    }
    else if (status_type === 'WrittenOff') {
      this.pledge_writtenoff = this.pledge_writtenoff
        .map(arrays => arrays.filter(arrayEl => arrayEl.mb_hashname.toLowerCase().indexOf(searchbar.target.value.toLowerCase()) > -1
          || arrayEl.pl_pymt_status.toLowerCase().indexOf(searchbar.target.value.toLowerCase()) > -1));

    }
    else {
      this.pledge_paid = this.pledge_paid
        .map(arrays => arrays.filter(arrayEl => arrayEl.mb_hashname.toLowerCase().indexOf(searchbar.target.value.toLowerCase()) > -1
          || arrayEl.pl_pymt_status.toLowerCase().indexOf(searchbar.target.value.toLowerCase()) > -1));


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
  togglePaid() {
    if (this.showPaid == true) { this.showPaid = false } else { this.showPaid = true };
  }
  toggleWrittenOff() {
    if (this.showWrittenOff == true) { this.showWrittenOff = false } else { this.showWrittenOff = true };
  }
  toggleUnpaid() {
    if (this.showUnpaid == true) { this.showUnpaid = false } else { this.showUnpaid = true };
  }
}
