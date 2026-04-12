import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Member } from '../../models/interfaces/member.model';
import { MemberAddPage } from '../../pages/member/member_add';
import { MemberViewPage } from '../../pages/member/member_view';
import { PrivilegeRole } from '../../models/interfaces/privilegerole.model';

@Component({
  selector: 'page-member',
  templateUrl: 'member.html',
})

export class MemberPage {
  segmember: string;

  public static readonly MEMBER_ADD_ACCESS = 'addMember';
  hasAddMemberAccess: boolean = false;

  member$: any;
  privilegerole$: Observable<PrivilegeRole[]>

  member: Member;
  tmpSearchObject;

  constructor(public authService: AuthService, public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,
    private db: DbserviceProvider

  ) {
    this.segmember = "Regular";
    console.log('MemberPage constructor');
  }

  ngOnInit() {
    console.log('MemberPage ngOnInit');
    //this.member$ = this.db.getMemberCollection();
    this.member$ = this.db.col$$('member',  ref => ref.where('mb_status', '==', 'Regular Member').orderBy('mb_hashname','asc'));
    this.privilegerole$ = this.db.col$$('privilegerole');
  }

  ngOnDestroy() {
    console.log('MemberPage ngOnDestroy');
    this.member$ = null;
  }

  ionViewDidLoad() {
    console.log('MemberPage ionViewDidLoad');
    this.tmpSearchObject = this.member$;
    if (this.authService.currentUser) {
      this.authService.currentUser.subscribe(
        user => {
          this.db.hasAccess(user.ro_name, MemberPage.MEMBER_ADD_ACCESS).subscribe(
            hasAddMemberAccess => { this.hasAddMemberAccess = hasAddMemberAccess; });
        }
      )

    }
  }

  addMember() {
    console.log('MemberPage addMember');
    //this.member$ = null;
    this.navCtrl.push(MemberAddPage);
  }

  viewMember(member: Member) {
    console.log('MemberPage viewMember');
    //this.member$ = null;
    this.navCtrl.push(MemberViewPage, {
      member: member
    });
  }

  viewMemberStatus(memberStatus: string) {
    console.log('MemberPage viewMember');
    //this.member$ = null;
    //let vR = this.col$$('privilegerole', ref => ref.where('pv_name', '==', privilege)).take(1)
    //this.col$$('hareline', ref => ref.where('hl_datetime', '>=', cfg[0].active_year)).

    if (memberStatus == 'All') {
      this.member$ = this.db.col$$('member', ref => ref.orderBy('mb_hashname','asc'));
    }
    else {
      this.member$ = this.db.col$$('member', ref => ref.where('mb_status', '==', memberStatus).orderBy('mb_hashname','asc'));
    }
  }

  deleteMember(id: any) {
    console.log('MemberPage deleteMember');
    this.db.delete('member', id);
    console.log('delete finished in member.ts');
  }

  search(searchbar) {
    var q = searchbar.target.value;

    if (q.trim() === '') {
      this.member$ = this.tmpSearchObject;
      return;
    }

    this.member$ = this.member$
      .map(arrays => arrays.filter(arrayEl => (arrayEl.mb_hashname.toLowerCase().indexOf(searchbar.target.value.toLowerCase()) > -1) ||
        (arrayEl.mb_status.toLowerCase().indexOf(searchbar.target.value.toLowerCase()) > -1)

      ));

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
}
