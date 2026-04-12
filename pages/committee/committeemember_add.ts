import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { ModalController } from 'ionic-angular';

import { ListComponent } from '../../components/listcomponent/listcomponent';
import { CommitteePage } from '../../pages/committee/committee';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Member } from '../../models/interfaces/member.model';
import { Role } from '../../models/interfaces/role.model';

@Component({
  selector: 'page-committeemember_add',
  templateUrl: 'committeemember_add.html',
})
export class CommitteeMemberAddPage {
  role$: Observable<Role[]>;
  groupmembers;
  tempgrpmembers;
  member$: Observable<Member[]>;
  committeememberForm: FormGroup;
  member: Member;
  items: string[];
  smember: string;
  smemberM: Member[];
  roItem;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private toastCtrl: ToastController
    , private db: DbserviceProvider, public events: Events, public modalCtrl: ModalController
  ) {
    console.log('CommitteeMemberAddPage constructor');
    this.committeememberForm = this.formBuilder.group({
      ro_name: [''],
      cm_sort: [''],
      ref_mb: ['']
    });
  }

  ionViewDidLoad() {
    console.log('CommitteeMemberAddPage ionViewDidLoad');
    this.member$ = this.db.col$$('member');
    this.role$ = this.db.col$$('role', ref => ref.orderBy('ro_order', 'asc'));


  }

  goback() {
    console.log('CommitteeMemberAddPage goback');
    this.navCtrl.setRoot(CommitteePage);
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
  addCommitteeMember(value: any) {

    console.log('CommitteeMemberAddPage addCommitteeMember ' + this.smemberM[0].id);

    const memberValues: any = {
      ro_name: value.ro_name.ro_name,
      cm_sort: value.cm_sort,
      mb_firstname: this.smemberM[0].mb_firstname,
      mb_hashname: this.smemberM[0].mb_hashname,
      mb_lastname: this.smemberM[0].mb_lastname,
      mb_email_id: this.smemberM[0].mb_email_id,
      mb_photo: this.smemberM[0].mb_photo,
      ref_mb: this.smemberM[0].id
    }
    this.db.addCommitteeMember(memberValues);
    this.navCtrl.setRoot(CommitteePage);
  }
  ngOnDestroy() {
    console.log('CommitteeMemberAddPage ngOnDestroy');
  }
}
