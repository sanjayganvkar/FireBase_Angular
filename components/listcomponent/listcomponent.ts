import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Member } from '../../models/interfaces/member.model';
import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

import { ViewController } from 'ionic-angular';

@Component({
  selector: 'listcomponent',
  templateUrl: 'listcomponent.html'
})
export class ListComponent {
  selectedMember: Member[] = [];
  member$: any;
  tmpSearchObject;
  listForm: FormGroup;
  sel = [];
  type;
  segmember: string;

  constructor(public authService: AuthService, public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, public alertCtrl: AlertController,
    private db: DbserviceProvider, public viewCtrl: ViewController

  ) {
    console.log('ListComponent constructor');
    this.segmember = "Regular";

    let tmp: string = this.navParams.get('sel');
    console.log('tmp');

    if (tmp != undefined) {
      this.sel = tmp.split(',');
    }
    console.log(this.sel);
    this.type = this.navParams.get('type');

    //// this.sel.forEach(ind => this.selectedArray[ind] = true);

    //this.member$ = this.db.col$$('member');
    //this.member$ = this.db.col$$('member',  ref => ref.orderBy('mb_hashname','asc'));
    this.member$ = this.db.col$$('member', ref => ref.where('mb_status', '==', 'Regular Member').orderBy('mb_hashname', 'asc'));

    this.tmpSearchObject = this.member$;

    this.db.col$$('member').subscribe(el => {
      el.map(mbr => {
        this.sel.forEach(s => {
          if (s == mbr.mb_hashname) {
            this.selectedMember.push(mbr);
          }
        })
      });
    });

    this.listForm = this.formBuilder.group({
    });
  }
  addSelection(member: Member) {
    console.log('ListComponent addSelection');
    var index = this.selectedMember.findIndex(x => x.mb_hashname == member.mb_hashname);
    if (this.selectedMember.length > 0 && this.type == "S") {/*S stands for single selection */
      let alert = this.alertCtrl.create({
        message: "You can only select one Hashman",
        buttons: [
          {
            text: "Ok",
            role: 'cancel'
          }
        ]
      });
      alert.present();
    }
    else {
      if (index === -1) {
        this.selectedMember.push(member);
      }
    }
  }

  viewMemberStatus(memberStatus: string) {
    console.log('MemberPage viewMember');
    if (memberStatus == 'All') {
      this.member$ = this.db.col$$('member', ref => ref.orderBy('mb_hashname', 'asc'));
    }
    else {
      this.member$ = this.db.col$$('member', ref => ref.where('mb_status', '==', memberStatus).orderBy('mb_hashname', 'asc'));
    }
  }

  goback() {
    this.navCtrl.setRoot(ListComponent);
  }

  addSelected() {
    console.log('ListComponent addSelected');
    this.viewCtrl.dismiss(this.selectedMember);
  }
  deleteSelection(member: Member) {
    console.log('ListComponent deleteSelection');
    this.selectedMember = this.selectedMember.filter(el => member.mb_hashname != el.mb_hashname);
    //delete this.selectedMember(member);
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

}
