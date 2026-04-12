import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { DbserviceProvider } from '../providers/dbservice/dbservice';

import { HomePage } from '../pages/home/home';
import { CommitteePage } from '../pages/committee/committee';
import { OnhomePage } from '../pages/onhome/onhome';
import { MemberPage } from '../pages/member/member';
import { HarelinePage } from '../pages/hareline/hareline';
//import { HarelineAddPage } from '../pages/hareline/hareline_add';
import { LoginPage } from '../pages/login/login';
import { Sh3Page } from '../pages/sh3/sh3';
import { ListPage } from '../pages/list/list';
import { PaymentPage } from '../pages/payment/payment';
import { PledgePage } from '../pages/pledge/pledge';
//import { PledgeAddPage } from '../pages/pledge/pledge_add';
import { AuthService } from '../providers/dbservice/authservice';

//import { ListComponent } from '../components/listcomponent/listcomponent';

@Component({
  templateUrl: 'app.html'
})
export class SH3 {
  @ViewChild(Nav) nav: Nav;

  // rootPage: any = CommitteePage;
  //rootPage: any = ListPage;
  rootPage: any = HomePage;
  // rootPage: any = RegisterPage;
  //rootPage: any = PledgeAddPage;
  //rootPage: any =  HomePage;
  //rootPage: any = HarelineAddPage;
  //rootPage: any = MemberPage;
   //rootPage: any = PaymentPage;
  //rootPage: any=LoginPage;
  //rootPage: any = ListComponent; 

  pages: Array<{ title: string, component: any, publicPage: boolean }>;

  public appTitle: string = "Seletar Hash House Harriers";

  constructor(
    public authService: AuthService,
    public platform: Platform,
    public menu: MenuController, private db: DbserviceProvider
  ) {
    this.initializeApp();

    this.pages = [
      { title: 'Login', component: LoginPage, publicPage: true },
      { title: 'Home', component: HomePage, publicPage: true },
      { title: 'Committee', component: CommitteePage, publicPage: true },
      { title: 'Hareline', component: HarelinePage, publicPage: true },
      { title: 'Members', component: MemberPage, publicPage: false },
      { title: 'Hashing with SH3', component: Sh3Page, publicPage: true },
      { title: 'Payment', component: PaymentPage, publicPage: false },
      { title: 'Pledges', component: PledgePage, publicPage: false },
      { title: 'OnHome Memorial', component: OnhomePage, publicPage: true }
      
    ]
  }

  filter(pageList) {

    if (!this.authService.isLoggedIn)
      return pageList.filter(page => page.publicPage == true);
    else
      return pageList;
  }

  initializeApp() {
    this.platform.ready().then(() => {
    });
  }

  openPage(page) {
    this.menu.close();
    this.nav.setRoot(page.component);
  }
}
