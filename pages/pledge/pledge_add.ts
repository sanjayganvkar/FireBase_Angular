import { AlertController, LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ModalController } from 'ionic-angular';

import { ListComponent } from '../../components/listcomponent/listcomponent';
import { ControlMessagesComponent } from '../../components/controlmessagescomponent';

import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ValidationserviceProvider } from '../../providers/dbservice/validationservice';
import { Member } from '../../models/interfaces/member.model';
import { PledgePage } from '../../pages/pledge/pledge';
import { PledgeType } from '../../models/interfaces/pledgetype.model';
import { PledgeItem } from '../../models/interfaces/pledgeitem.model';

@Component({
  selector: 'page-pledge_add',
  templateUrl: 'pledge_add.html',
})
export class PledgeAddPage {

  loading: any;

  pledgetype$: Observable<PledgeType[]>;
  pledgeitem$: Observable<PledgeItem[]>;
  defpledgeitem$: Observable<PledgeItem[]>;
  member$: Observable<Member[]>;
  memberForm: FormGroup;
  pledgeForm: FormGroup;
  member: Member;
  harelineid: string = null;
  pl_date: string = new Date(new Date().getFullYear(), new Date().getMonth() , new Date().getDate() + 1).toISOString().substring(0, 10);
  pl_pymt_status: string;
  hl_runno = 0;
  pi_rate;
  pi_name = 'Crate of White';
  pl_qty = 1;
  pl_rate_white = 70;
  pl_rate_black = 105;
  pi_default;
  pl_amount = 70;
  smember: string;
  smemberM: Member[];

  constructor(public authService: AuthService, public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private toastCtrl: ToastController
    , private db: DbserviceProvider, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, public modalCtrl: ModalController
  ) {
    console.log('PledgeAddPage constructor');

    if (!(this.navParams.get('hareline') == undefined || this.navParams.get('hareline') == null)) {
      this.harelineid = this.navParams.get('hareline').id;
      this.pl_date = this.navParams.get('hareline').hl_datetime;
      this.hl_runno = this.navParams.get('hareline').hl_runno;
    }

    this.pledgeForm = this.formBuilder.group({
      mb_hashname: ['',[Validators.required]],
      hl_runno: [this.hl_runno, [Validators.required, Validators.min(1), Validators.max(9999)]],
      mb_photo: [''],
      pl_date: [this.pl_date,[Validators.required]],
      pt_name: ['Run Pledge',[Validators.required]],
      pl_description: [''],
      pi_name: [this.pi_name,[Validators.required]],
      pl_qty: [this.pl_qty, [Validators.required, Validators.min(1), Validators.max(100)]],
      pi_rate: this.pl_rate_white,
      pl_amount: this.pl_amount,
      pl_pymt_status: ['Unpaid',[Validators.required]]
    });
  }

  ionViewDidLoad() {
    console.log('PledgeAddPage ionViewDidLoad');
    if (!(this.navParams.get('hareline') == undefined || this.navParams.get('hareline') == null)) {
      this.harelineid = this.navParams.get('hareline').id;
      this.pl_date = this.navParams.get('hareline').hl_datetime;
      if (!(this.navParams.get('hareline').hl_runno == undefined || this.navParams.get('hareline').hl_runno == null)) {
        this.hl_runno = this.navParams.get('hareline').hl_runno;
      }
    }
    this.member$ = this.db.col$$('member', ref => ref.orderBy('mb_hashname'));
    this.pledgetype$ = this.db.col$$('pledgetype', ref => ref.orderBy('pt_name'));
    this.pledgeitem$ = this.db.col$$('pledgeitem', ref => ref.orderBy('pi_name'));
    this.pledgeitem$ = this.db.col$$('pledgeitem', ref => ref.orderBy('pi_name'));
    //this.defpledgeitem$ = this.db.col$$('pledgeitem', ref => ref .orderBy('pi_name'));
    this.db.col$$('pledgeitem', ref => ref.where('pi_default', '==', 'true')).take(1).subscribe(plegeitem => {
      plegeitem.map(mb => {
        //console.error('defpledgeitem ' + mb);
      }
      )
    });
  }


  selectMember(val) {
    console.log('HarelineAddPage selectHareList');
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
    console.log('PledgeAddPage goback');
    this.navCtrl.pop();
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


  addPledge(value: any) {
    console.log('PledgeAddPage addPledge');

    const formValues: any = {
      mb_hashname: this.smemberM[0].mb_hashname,
      mb_photo: this.smemberM[0].mb_photo,
      pl_date: this.pl_date,
      pt_name: value.pt_name,
      pl_description: '',
      hl_runno: value.hl_runno,
      pi_name: value.pi_name,
      pl_qty: value.pl_qty,
      pi_rate: value.pi_rate,
      pl_amount: value.pl_amount,
      pl_pymt_status: value.pl_pymt_status,
      hl_id: this.harelineid

    }

    if (this.pledgeForm.dirty && this.pledgeForm.valid) {
      this.db.add('pledge', formValues);
      this.navCtrl.pop();
    }
  }

  ngOnDestroy() {
    console.log('PledgeAddPage ngOnDestroy');
  }

}
