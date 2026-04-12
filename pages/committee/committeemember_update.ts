import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { CommitteePage } from '../../pages/committee/committee';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Role } from '../../models/interfaces/role.model';

@Component({
  selector: 'page-committeemember_update',
  templateUrl: 'committeemember_update.html',
})
export class CommitteeMemberUpdatePage {
  id: string;
  mb_email_id: string;
  mb_hashname: string;
  mb_firstname: string;
  mb_lastname: string;
  mb_photo: string;     

  ref_mb: string;     
  ro_name: string;
  cm_sort: string;

  committeememberForm: FormGroup;
  role$: Observable<Role[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private db: DbserviceProvider
  ) {

    console.log('CommitteeMemberUpdatePage constructor');
    this.role$ = this.db.col$$('role');
    this.id = this.navParams.get('committeemember').id;
    this.mb_email_id = this.navParams.get('committeemember').mb_email_id;
    this.mb_hashname = this.navParams.get('committeemember').mb_hashname;
    this.mb_firstname = this.navParams.get('committeemember').mb_firstname;
    this.mb_lastname = this.navParams.get('committeemember').mb_lastname;
   
    this.mb_photo = this.navParams.get('committeemember').mb_photo;
    this.ref_mb = this.navParams.get('committeemember').ref_mb;
    this.ro_name = this.navParams.get('committeemember').ro_name;
    this.cm_sort = this.navParams.get('committeemember').cm_sort;
    this.committeememberForm = this.formBuilder.group({
      ro_name: [this.ro_name],
      cm_sort: [this.cm_sort],
      ref_mb: [this.ref_mb]
    });
  }

  ngOnDestroy() {
    console.log('CommitteeMemberUpdatePage ngOnDestroy');
    this.role$ = null;
  }

  ionViewDidLoad() {
    console.log('CommitteeMemberUpdatePage ionViewDidLoad');
  }

  goback() {
    console.log('CommitteeMemberUpdatePage goback');
    this.navCtrl.setRoot(CommitteePage);
  }
 
  updateCommitteeMember(id: string, value: any) {
    console.log('CommitteeMemberUpdatePage updateCommitteeMember');
    const memberValues: any = {
      ro_name: value.ro_name,
      cm_sort: value.cm_sort,
      ref_mb: value.ref_mb
    }
    this.db.updateCommitteeMember(id, memberValues);
    this.navCtrl.setRoot(CommitteePage);
  }
}
