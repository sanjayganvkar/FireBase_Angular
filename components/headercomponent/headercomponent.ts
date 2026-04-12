import { Component } from '@angular/core';
import { AuthService } from '../../providers/dbservice/authservice';

import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HomePage } from '../../pages/home/home';
import { LoginPage } from '../../pages/login/login';
import { MemberViewPage } from '../../pages/member/member_view';

import { Member } from '../../models/interfaces/member.model';
@Component({
  selector: 'headercomponent',
  templateUrl: 'headercomponent.html'
})
export class HeaderComponent {

  currentUser: Observable<Member>;
  member: Member;
  constructor(private authService: AuthService, public navCtrl: NavController) {
    console.log('HeaderComponent constructor');

    if (this.authService.currentUser) {

      this.authService.currentUser.subscribe(
        user => {

          this.currentUser = user;
        })
    };
  }
  doLogout(): any {
    console.log('HeaderComponent doLogout');
    this.authService.doLogout();
    this.navCtrl.setRoot(HomePage);

  }
  ionViewDidLoad() {
    console.log('HeaderComponent ionViewDidLoad');

  }
  ngOninit() {
    console.log('HeaderComponent ngOninit');

  }
  doLogin(): any {
    console.log('HeaderComponent doLogin');
    this.navCtrl.push(LoginPage);
  }
  viewMember(member: Member) {
    console.log('MemberPage viewMember');
    this.navCtrl.push(MemberViewPage, {
      member: member
    });
  }

}
