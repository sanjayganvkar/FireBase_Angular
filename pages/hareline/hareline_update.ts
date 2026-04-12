import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ModalController } from 'ionic-angular';

import { ListComponent } from '../../components/listcomponent/listcomponent';

import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ValidationserviceProvider } from '../../providers/dbservice/validationservice';
import { HarelinePage } from '../../pages/hareline/hareline';
import { Member } from '../../models/interfaces/member.model';
//My Test
@Component({
  selector: 'page-hareline_update',
  templateUrl: 'hareline_update.html',
})
export class HarelineUpdatePage {
  id: string;
  hl_name: string;
  hl_datetime: string;
  hl_publish: boolean;
  hl_scribe: string;
  hl_hare: string;
  hl_runno: string;
  hl_runsite: string;
  hl_gps: string;
  hl_runtype: string;
  hl_runfee: string;
  hl_guestfee: string;
  hl_comment: string;
  hares: string;
  scribe: string;
  hareM: Member[];
  scribeM: Member[];
  member$: Observable<Member[]>;
  harelineForm: FormGroup;
  MaxYear = new Date(new Date());
  MM= parseInt( this.MaxYear.toISOString().substring(0, 4))+2;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private db: DbserviceProvider, public modalCtrl: ModalController
  ) {
    console.log('HarelineUpdatePage constructor');
    this.member$ = this.db.col$$('member');
    this.id = this.navParams.get('hareline').id;
    this.hl_name = this.navParams.get('hareline').hl_name;
    this.hl_datetime = this.navParams.get('hareline').hl_datetime;
    this.hl_publish = this.navParams.get('hareline').hl_publish;
    this.hl_scribe = this.navParams.get('hareline').hl_scribe;
    this.hl_hare = this.navParams.get('hareline').hl_hare;
    this.hl_runno = this.navParams.get('hareline').hl_runno;
    this.hl_runsite = this.navParams.get('hareline').hl_runsite;
    this.hl_gps = this.navParams.get('hareline').hl_gps;
    this.hl_runtype = this.navParams.get('hareline').hl_runtype;
    this.hl_runfee = this.navParams.get('hareline').hl_runfee;
    this.hl_guestfee = this.navParams.get('hareline').hl_guestfee;
    this.hl_comment = this.navParams.get('hareline').hl_comment;
    this.harelineForm = this.formBuilder.group({
      hl_name: [this.hl_name],
      hl_datetime: [this.hl_datetime, Validators.required],
      hl_publish: [this.hl_publish],
      hl_scribe: [this.hl_scribe],
      hl_hare: [this.hl_hare],
      hl_runno: [this.hl_runno, [Validators.required, Validators.min(1), Validators.max(9999)]],
      hl_runsite: [this.hl_runsite],
      hl_gps: [this.hl_gps],
      hl_runtype: [this.hl_runtype],
      hl_runfee: [this.hl_runfee],
      hl_guestfee: [this.hl_guestfee],
      hl_comment: [this.hl_comment]
    });
    this.hares = this.hl_hare;
    this.scribe = this.hl_scribe;
  }

  selectScribeList(val) {
    console.log('HarelineAddPage selectScribeList');
    let selection = this.modalCtrl.create(ListComponent, { obs: 'member', sel: val });
    selection.present();
    selection.onDidDismiss(data => {
      this.scribeM = data;
      this.scribe = data.map(v => v.mb_hashname).toString();
    });
  }
  selectHareList(val) {
    console.log('HarelineAddPage selectHareList');
    let selection = this.modalCtrl.create(ListComponent, { obs: 'member', sel: val });
    selection.present();
    selection.onDidDismiss(data => {
      this.hareM = data;
      this.hares = data.map(v => v.mb_hashname).toString();
    });
  }

  ngOnDestroy() {
    console.log('HarelineUpdatePage ngOnDestroy');
  }

  ionViewDidLoad() {
    console.log('HarelineUpdatePage ionViewDidLoad');
  }

  goback() {
    console.log('HarelineUpdatePage goback');
    this.navCtrl.setRoot(HarelinePage);
  }

  updateHareline(id: string, value: any) {
    console.log('HarelineUpdatePage updateHareline');
    const formValues: any = {
      hl_name: value.hl_name,
      hl_datetime: value.hl_datetime,
      hl_publish: value.hl_publish,
      hl_scribe: value.hl_scribe,
      hl_hare: value.hl_hare,
      hl_runno: value.hl_runno,
      hl_runsite: value.hl_runsite,
      hl_gps: value.hl_gps,
      hl_runtype: value.hl_runtype,
      hl_runfee: value.hl_runfee,
      hl_guestfee: value.hl_guestfee,
      hl_comment: value.hl_comment
    };
    this.db.update('hareline', id, formValues);
    this.navCtrl.setRoot(HarelinePage);
  }
}
