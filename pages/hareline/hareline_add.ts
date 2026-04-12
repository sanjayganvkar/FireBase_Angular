import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';


import { ModalController } from 'ionic-angular';

import { ListComponent } from '../../components/listcomponent/listcomponent';

import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ValidationserviceProvider } from '../../providers/dbservice/validationservice';
import { Hareline } from '../../models/interfaces/hareline.model';
import { HarelinePage } from '../../pages/hareline/hareline';
import { Member } from '../../models/interfaces/member.model';
import { Sh3Page } from '../../pages/sh3/sh3';

@Component({
  selector: 'page-hareline_add',
  templateUrl: 'hareline_add.html',
})
export class HarelineAddPage {
  hareline$: Observable<Hareline[]>;
  harelineForm: FormGroup;
  hareline: Hareline;
  member$: Observable<Member[]>;
  member: Member;
  hares: string;
  scribe: string;
  hareM: Member[];
  scribeM: Member[];
  tmpSearchObject;
  MaxYear = new Date(new Date());
  MM= parseInt( this.MaxYear.toISOString().substring(0, 4))+2;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private toastCtrl: ToastController
    , private db: DbserviceProvider,
    public modalCtrl: ModalController
  ) {
    console.log('HarelineAddPage constructor');
    console.error("MaxYear:"+ this.MaxYear);
    console.error("MM:"+ this.MM);
    this.member$ = this.db.col$$('member');
    this.harelineForm = this.formBuilder.group({
      hl_runno: ['', [Validators.required, Validators.min(1), Validators.max(9999)]],
      hl_name: [''],
      hl_datetime: ['', Validators.required],
      hl_publish: [''],
      hl_scribe: [''],
      hl_hare: [''],
      hl_runsite: [''],
      hl_gps: [''],
      hl_runtype: [''],
      hl_runfee: [''],
      hl_guestfee: [''],
      hl_comment: ['']
    });
  }

  selectScribeList(val) {
    console.log('HarelineAddPage selectScribeList');
    let selection = this.modalCtrl.create(ListComponent, { obs: 'member', sel: val, type:"S" });

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


  ionViewDidLoad() {
    console.log('HarelineAddPage ionViewDidLoad');   
    this.tmpSearchObject = this.member$;
  }

  goback() {
    console.log('HarelineAddPage goback');
    this.navCtrl.setRoot(HarelinePage);

  }
  search(searchbar) {
    var q = searchbar.target.value;
    if (q.trim() === '') {
      this.member$ = this.tmpSearchObject;
      return;
    }

    this.member$ = this.member$
      .map(arrays => arrays.filter(arrayEl => arrayEl.mb_hashname.toLowerCase().indexOf(searchbar.target.value.toLowerCase()) > -1));
  }

  addHareline(value: any) {
    console.log('HarelineAddPage addHareline');
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
    }
    this.db.add('hareline', formValues);
    this.navCtrl.setRoot(HarelinePage);
  }
  ngOnDestroy() {
    console.log('HarelineAddPage ngOnDestroy');
  }
}
