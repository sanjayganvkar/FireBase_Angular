import { AlertController, LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { HomePage } from '../../pages/home/home';
import { MemberAddPage } from '../../pages/member/member_add';
import { ResetpwdPage } from '../../pages/resetpwd/resetpwd';

import { Member } from '../../models/interfaces/member.model';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  currentUser: Member;
  loading: any;
  loginForm: FormGroup;
  mb_email_id: string = "";
  mb_password: string = "";
  

  constructor(public authService: AuthService, public navCtrl: NavController, public navParams: NavParams,

    private formBuilder: FormBuilder, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, private db: DbserviceProvider, private storage: Storage) {

    this.storage.get('mb_email_id').then(mb_email_id => {
      this.mb_email_id = mb_email_id;
    });

    this.storage.get('mb_password').then(mb_password => {
      this.mb_password = mb_password;
    });

    this.loginForm = this.formBuilder.group({
      mb_email_id: [],
      mb_password: [] //  mb_password: []
    });

  } 

  loginUser() {
    console.log("LoginPage loginUser");

    this.authService.loginUser(this.loginForm.value.mb_email_id, this.loginForm.value.mb_password)
      .subscribe(mbr => {
        if (mbr) {
          this.db.addData();

          this.storage.set('mb_email_id', this.loginForm.value.mb_email_id);
          this.storage.set('mb_password', this.loginForm.value.mb_password);
          this.authService.isLoggedIn = true;
          this.authService.currentUser = Observable.of(mbr[0]);
          this.navCtrl.setRoot(HomePage);

          mbr[0].ro_name = [];
          mbr[0].ro_name = [mbr[0].mb_status];

          this.db.col$$('committee', ref => ref.where('co_active', '==', true)).take(1).subscribe(comm => {
            //console.error('CommitteePage ngOnInitn ' + comm[0].id);
            this.db.getCommitteeMemberCollection(comm[0].id).subscribe
              (cm => cm.map(data => {
                if (data.mb_hashname === mbr[0].mb_hashname) {
                  mbr[0].ro_name.push(data.ro_name);
                }
              }
              )
              );
          });
        }
      });
  }

  register() {
    this.navCtrl.push(MemberAddPage);
  }
  resetPwd() {
    this.navCtrl.push(ResetpwdPage);
  }

  goback() {
    console.log('LoginPage goback');
    this.navCtrl.setRoot(HomePage);
  }
}
