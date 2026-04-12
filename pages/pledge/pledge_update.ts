import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ValidationserviceProvider } from '../../providers/dbservice/validationservice';
import { MemberPage } from '../../pages/member/member';
import { PledgePage } from '../../pages/pledge/pledge';
import { PledgeItem } from '../../models/interfaces/pledgeitem.model';
import { PledgeType } from '../../models/interfaces/pledgetype.model';

@Component({
  selector: 'page-pledge_update',
  templateUrl: 'pledge_update.html',
})
export class PledgeUpdatePage {
  pledgetype$: Observable<PledgeType[]>;
  pledgeitem$: Observable<PledgeItem[]>;
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
  pl_amount: number;
  pl_rate_white = 70;
  pl_rate_black = 105;
  pl_pymt_status: string;
  pledgeForm: FormGroup;
  pItem;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private db: DbserviceProvider
  ) {
    console.log('PledgeUpdatePage constructor');


    this.pledgetype$ = this.db.col$$('pledgetype', ref => ref.orderBy('pt_name'));
    this.pledgeitem$ = this.db.col$$('pledgeitem', ref => ref.orderBy('pi_name'));
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

    this.pledgeForm = this.formBuilder.group({
      mb_hashname: [this.mb_hashname,[Validators.required]],
      mb_photo: [this.mb_photo],
      hl_runno: [this.hl_runno, [Validators.required, Validators.min(1), Validators.max(9999)]],
      pl_date: [this.pl_date,[Validators.required]],
      pt_name: [this.pt_name,[Validators.required]],
      pi_name: [this.pi_name,[Validators.required]],
      pl_description: [this.pl_description],
      pl_qty: [this.pl_qty, [Validators.required, Validators.min(1), Validators.max(100)]],
      pi_rate: [this.pi_rate],
      pl_amount: [this.pl_amount],
      pl_pymt_status: [this.pl_pymt_status,[Validators.required]]

    });
    this.pItem = this.pledgeForm.value;
    console.log(this.pItem);
  }
  ngOnDestroy() {
    console.log('PledgeUpdatePage ngOnDestroy');
    this.pledgetype$ = null;
  }

  ionViewDidLoad() {
    console.log('PledgeUpdatePage ionViewDidLoad');
  }

  goback() {
    console.log('PledgeUpdatePage goback');
    this.navCtrl.setRoot(PledgePage);
  }
  changeSelect_pi_name(_pi_name) {
    this.pi_name = _pi_name;
    this.calc_amount();
  }
  onInput_pl_qty(_pl_qty) {
    this.pl_qty = _pl_qty;
    this.calc_amount();
  }

  calc_amount() {

    if (this.pi_name == "Crate of White") {
      this.pl_amount = this.pl_rate_white * this.pl_qty;
    }
    else {
      this.pl_amount = this.pl_rate_black * this.pl_qty;
    }
  }

  updatePledge(id: string, value: any) {
    console.log('PledgeUpdatePage updateMember');
    const formValues: any = {
      mb_hashname: value.mb_hashname,
      mb_photo: value.mb_photo,
      hl_runno: value.hl_runno,
      pl_date: value.pl_date,
      pt_name: value.pt_name,
      pi_name: value.pi_name,
      pl_description: value.pl_description,
      pl_qty: value.pl_qty,
      pi_rate: value.pi_rate,
      pl_amount: value.pl_amount,
      pl_pymt_status: value.pl_pymt_status
    }
    this.db.update('pledge', id, formValues);
    this.navCtrl.setRoot(PledgePage);
  }
}
