import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/dbservice/authservice';
import { CommitteeMemberUpdatePage } from '../../pages/committee/committeemember_update';
import { CommitteePage } from '../../pages/committee/committee';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Member } from '../../models/interfaces/member.model';

@Component({
  selector: 'page-committeemember_view',
  templateUrl: 'committeemember_view.html',
})
export class CommitteeMemberViewPage {
  currentUser: Member;
  public static readonly CMBR_UPD_ACCESS = 'updateCommitteemember';
  public static readonly CMBR_DEL_ACCESS = 'deleteCommitteemember';
  hasUpdCMbrAccess: boolean = false;
  hasDelCMbrAccess: boolean = false;

  id: string;
  mb_email_id: string;
  mb_hashname: string;
  mb_firstname: string;
  mb_lastname: string;
  mb_photo: string;
  ro_name: string;
  cm_sort: string;
  ref_mb: string;

  constructor(public authService: AuthService, public navCtrl: NavController, public navParams: NavParams
    , public alertCtrl: AlertController, private db: DbserviceProvider
  ) {
    console.log('CommitteeMemberViewPage constructor');
  }

  ionViewDidLoad() {
    console.log('CommitteeMemberViewPage ionViewDidLoad');
    this.id = this.navParams.get('committeemember').id;

    this.mb_email_id = this.navParams.get('committeemember').mb_email_id;
    this.mb_hashname = this.navParams.get('committeemember').mb_hashname;
    this.mb_firstname = this.navParams.get('committeemember').mb_firstname;
    this.mb_lastname = this.navParams.get('committeemember').mb_lastname;
    this.mb_photo = this.navParams.get('committeemember').mb_photo;
    this.ro_name = this.navParams.get('committeemember').ro_name;
    this.cm_sort = this.navParams.get('committeemember').cm_sort;
    this.ref_mb = this.navParams.get('committeemember').ref_mb;

    if (this.authService.currentUser) {
      this.authService.currentUser.subscribe(
        user => {
          this.currentUser = user;
          this.db.hasAccess(user.ro_name, CommitteeMemberViewPage.CMBR_UPD_ACCESS).subscribe(
            hasUpdCMbrAccess => { this.hasUpdCMbrAccess = hasUpdCMbrAccess; });
          this.db.hasAccess(user.ro_name, CommitteeMemberViewPage.CMBR_DEL_ACCESS).subscribe(
            hasDelCMbrAccess => { this.hasDelCMbrAccess = hasDelCMbrAccess; });
        }
      )
    }

  }
  ngOnDestroy() {
    console.log('CommitteeMemberViewPage ngOnDestroy');
    // this.navCtrl.push(CommitteePage);
  }

  deleteCommitteeMember(id: string, ref_mb: string) {

    console.log('CommitteeMemberViewPage deleteMember');
    this.showConfirm("Committee Member", "Delete " + this.mb_hashname + " from the Committee", id, ref_mb);
  }
  updateCommitteeMember(id: any) {
    console.log('CommitteeMemberViewPage updateCommitteeMember');
    const committeememberValues: any = {
      id: this.id,
      mb_email_id: this.mb_email_id,
      mb_hashname: this.mb_hashname,
      mb_firstname: this.mb_firstname,
      mb_lastname: this.mb_lastname,
      mb_photo: this.mb_photo,
      ro_name: this.ro_name,
      cm_sort: this.cm_sort,
      ref_mb: this.ref_mb
    }
    this.navCtrl.push(CommitteeMemberUpdatePage, {
      committeemember: committeememberValues
    });
  }

  showConfirm(title: string, message: string, id: string, ref_mb: string) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.db.deleteCommitteeMember(id, ref_mb);
            this.navCtrl.setRoot(CommitteePage);
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
