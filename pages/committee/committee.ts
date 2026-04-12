import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/dbservice/authservice';
import { Committee } from '../../models/interfaces/committee.model';
import { CommitteeMember } from '../../models/interfaces/committee.model';
import { CommitteeMemberAddPage } from '../../pages/committee/committeemember_add';
import { CommitteeMemberViewPage } from '../../pages/committee/committeemember_view';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Member } from '../../models/interfaces/member.model';

@Component({
  selector: 'page-committee',
  templateUrl: 'committee.html',
})

export class CommitteePage {
  currentUser: Member;
  public static readonly CMBR_ADD_ACCESS = 'addCommitteemember';
  hasAddCMbrAccess: boolean = false;

  committeeMember$: any;
  tmpSearchObject;
  committee: Committee;
  committeemember: CommitteeMember;
  constructor(public authService: AuthService, public navCtrl: NavController, public navParams: NavParams, private db: DbserviceProvider, public modalCtrl: ModalController) {

  }

  ngOnInit() {
    console.log('CommitteePage ngOnInit');
    this.db.col$$('committee', ref => ref.where('co_active', '==', true)).take(1).subscribe(comm => {
      this.committee = comm[0];
      console.log('CommitteePage ngOnInitn ' + this.committee.id);
      this.tmpSearchObject = this.committeeMember$ = this.db.getCommitteeMemberCollection(this.committee.id);
    });
  }

  viewCommitteeMember(committeemember: CommitteeMember) {
    console.log('CommitteePage viewCommitteeMember');
   this.navCtrl.push(CommitteeMemberViewPage, {
      committeemember: committeemember
    });
  }

  addCommitteeMember() {
    console.log('CommitteePage addCommitteeMember');
    this.navCtrl.push(CommitteeMemberAddPage);
  }

  ionViewDidLoad() {
    console.log('CommitteePage ionViewDidLoad');
    console.log(this.authService.currentUser);
    if (this.authService.currentUser) {
      this.authService.currentUser.subscribe(
        user => {
          this.currentUser = user;
          this.db.hasAccess(user.ro_name, CommitteePage.CMBR_ADD_ACCESS).subscribe(
            hasAddCMbrAccess => { this.hasAddCMbrAccess = hasAddCMbrAccess; });
        }
      )
    }
  }
  search(searchbar) {
    console.log('ionViewDidLoad searchbar');
    var q = searchbar.target.value;

    if (q.trim() === '') {
      this.committeeMember$ = this.tmpSearchObject;
      return;
    }
    console.log('ionViewDidLoad searchbar 2');

    this.committeeMember$ = this.committeeMember$
      .map(arrays => arrays.filter(arrayEl => arrayEl.mb_hashname.toLowerCase().indexOf(searchbar.target.value.toLowerCase()) > -1));

  }
}