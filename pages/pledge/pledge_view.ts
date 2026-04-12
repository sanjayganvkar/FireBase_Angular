import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { PledgePage } from '../../pages/pledge/pledge';
import { PledgeUpdatePage } from '../../pages/pledge/pledge_update';

@Component({
  selector: 'page-pledge_view',
  templateUrl: 'pledge_view.html',
})
export class PledgeViewPage {
  public static readonly PLEDGE_HL_UPD_ACCESS = 'updateRunPledge';
  public static readonly PLEDGE_BD_UPD_ACCESS = 'updateBirthdayPledge';
  public static readonly PLEDGE_HL_DEL_ACCESS = 'deleteRunPledge';
  public static readonly PLEDGE_BD_DEL_ACCESS = 'deleteBirthdayPledge';
  page: string = 'view';
  hasUpdRunPledgeAccess: boolean = false;
  hasUpdBdayPledgeAccess: boolean = false;
  hasDelRunPledgeAccess: boolean = false;
  hasDelBdayPledgeAccess: boolean = false;
  pledge: any;
  id: string;
  mb_hashname: string;
  mb_photo: string;
  hl_runno;
  pl_date: string;
  pt_name: string;
  pi_name: string;
  pl_description: string;
  pl_qty: number;
  pi_rate: number;
  pl_amount: string;
  pl_pymt_status: string;
  hl_id: string;

  constructor(private authService: AuthService, public navCtrl: NavController, public navParams: NavParams
    , public alertCtrl: AlertController, private db: DbserviceProvider
  ) {
    console.log('PledgeViewPage constructor');
  }

  ionViewDidLoad() {
    console.log('PledgeViewPage ionViewDidLoad');
    this.id = this.navParams.get('pledge').id;
    this.mb_hashname = this.navParams.get('pledge').mb_hashname;
    this.mb_photo = this.navParams.get('pledge').mb_photo;
    this.hl_runno = this.navParams.get('pledge').hl_runno;
    this.pl_date = this.navParams.get('pledge').pl_date;
    this.pt_name = this.navParams.get('pledge').pt_name;
    this.pi_name = this.navParams.get('pledge').pi_name;
    this.pl_description = this.navParams.get('pledge').pl_description;
    this.pl_qty = this.navParams.get('pledge').pl_qty;
    this.pi_rate = this.navParams.get('pledge').pi_rate;
    this.pl_amount = this.navParams.get('pledge').pl_amount;
    this.pl_pymt_status = this.navParams.get('pledge').pl_pymt_status;
    this.hl_id = this.navParams.get('pledge').hl_id;
    this.pledge = Observable.of([this.navParams.get('pledge')]);
    if (this.authService.currentUser) {
      this.authService.currentUser.subscribe(
        user => {
          this.db.hasAccess(user.ro_name, PledgeViewPage.PLEDGE_HL_UPD_ACCESS).subscribe(
            hasUpdRunPledgeAccess => { this.hasUpdRunPledgeAccess = hasUpdRunPledgeAccess; });
        }
      )
      this.authService.currentUser.subscribe(
        user => {
          this.db.hasAccess(user.ro_name, PledgeViewPage.PLEDGE_BD_UPD_ACCESS).subscribe(
            hasUpdBdayPledgeAccess => { this.hasUpdBdayPledgeAccess = hasUpdBdayPledgeAccess; });
        }
      )
      this.authService.currentUser.subscribe(
        user => {
          this.db.hasAccess(user.ro_name, PledgeViewPage.PLEDGE_HL_DEL_ACCESS).subscribe(
            hasDelRunPledgeAccess => { this.hasDelRunPledgeAccess = hasDelRunPledgeAccess; });
        }
      )
      this.authService.currentUser.subscribe(
        user => {
          this.db.hasAccess(user.ro_name, PledgeViewPage.PLEDGE_BD_DEL_ACCESS).subscribe(
            hasDelBdayPledgeAccess => { this.hasDelBdayPledgeAccess = hasDelBdayPledgeAccess; });
        }
      )
    }

  }
  ngOnDestroy() {
    console.log('PledgeViewPage ngOnDestroy');
  }
  deletePledge(id: any) {
    console.log('PledgeViewPage deletePledge');
    this.showConfirm("Pledge", "Do you want to delete the Pledge?", id);
  }
  updatePledge(id: any) {
    console.log('PledgeViewPage updatePledge');
    const formValues: any = {
      id: this.id,
      mb_hashname: this.mb_hashname,
      mb_photo: this.mb_photo,
      hl_runno: this.hl_runno,
      pl_date: this.pl_date,
      pt_name: this.pt_name,
      pi_name: this.pi_name,
      pl_description: this.pl_description,
      pl_qty: this.pl_qty,
      pi_rate: this.pi_rate,
      pl_amount: this.pl_amount,
      pl_pymt_status: this.pl_pymt_status,
      hl_id: this.hl_id
    }
    console.log(formValues);
    this.navCtrl.push(PledgeUpdatePage, {
      pledge: formValues
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
            this.db.delete('pledge', id);
            this.navCtrl.setRoot(PledgePage);
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
