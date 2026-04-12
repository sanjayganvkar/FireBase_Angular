import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { HeaderComponent } from '../components/headercomponent/headercomponent';
import { PledgeComponent } from '../components/pledgecomponent/pledgecomponent';
import { AttendanceComponent } from '../components/attendancecomponent/attendancecomponent';
import { SearchComponent } from '../components/searchcomponent/searchcomponent';
import { ListComponent } from '../components/listcomponent/listcomponent';
import { PaymentComponent } from '../components/paymentcomponent/paymentcomponent';
import { ControlMessagesComponent } from '../components/controlmessagescomponent';

import { AttendanceAddPage } from '../components/attendancecomponent/attendance_add';
import { SH3 } from './app.component';
import { Sh3Page } from '../pages/sh3/sh3';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { CommitteePage } from '../pages/committee/committee';
import { CommitteeMemberViewPage } from '../pages/committee/committeemember_view';
import { CommitteeMemberUpdatePage } from '../pages/committee/committeemember_update'
import { CommitteeMemberAddPage } from '../pages/committee/committeemember_add'
import { RatingPage } from '../pages/rating/rating';
import { OnhomePage } from '../pages/onhome/onhome';
import { MemberPage } from '../pages/member/member';
import { MemberAddPage } from '../pages/member/member_add';
import { MemberViewPage } from '../pages/member/member_view';
import { MemberUpdatePage } from '../pages/member/member_update';
import { HarelinePage } from '../pages/hareline/hareline';
import { HarelineAddPage } from '../pages/hareline/hareline_add';
import { HarelineViewPage } from '../pages/hareline/hareline_view';
import { HarelineUpdatePage } from '../pages/hareline/hareline_update';

import { PledgePage } from '../pages/pledge/pledge';
import { PledgeAddPage } from '../pages/pledge/pledge_add';
import { PledgeViewPage } from '../pages/pledge/pledge_view';
import { PledgeUpdatePage } from '../pages/pledge/pledge_update';

import { PaymentPage } from '../pages/payment/payment';
import { PaymentAddPage } from '../pages/payment/payment_add';
import { PaymentViewPage } from '../pages/payment/payment_view';
import { PaymentUpdatePage } from '../pages/payment/payment_update';

import { DbserviceProvider } from '../providers/dbservice/dbservice';
import { AuthService } from '../providers/dbservice/authservice';
import { ValidationserviceProvider } from '../providers/dbservice/validationservice';

import { IonicStorageModule } from '@ionic/storage';

import { LoginPage } from '../pages/login/login';
import { ResetpwdPage } from '../pages/resetpwd/resetpwd';

import { AgmCoreModule } from '@agm/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
//import { SelectSearchableModule } from 'ionic-select-searchable';
//import { SocialSharing } from '@ionic-native/social-sharing';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  databaseURL: "xxx",
  storageBucket: "xxx",
  projectId: "xxx",
  messagingSenderId: "xxx"
};

// GOOGLE MAP  Settings
export const googlemapConfig = {
  apiKey: "GoogleAPiey"
};


@NgModule({
  declarations: [
    SH3,
    HomePage,
    ListPage,
    Sh3Page,
    CommitteePage,
    CommitteeMemberViewPage, CommitteeMemberUpdatePage, CommitteeMemberAddPage,
    OnhomePage,
    MemberPage, MemberAddPage, MemberViewPage, MemberUpdatePage,
    PledgePage, PledgeAddPage, PledgeViewPage, PledgeUpdatePage,
    PaymentPage, PaymentAddPage, PaymentViewPage, PaymentUpdatePage,
    // AttendancePage,// AttendanceAddPage, AttendanceViewPage,AttendanceUpdatePage,
    HarelinePage, HarelineAddPage, HarelineViewPage, HarelineUpdatePage,
    RatingPage,
    LoginPage, ResetpwdPage,
    HeaderComponent,
    PledgeComponent,
    AttendanceComponent,
    PaymentComponent,
    ControlMessagesComponent,
    SearchComponent, ListComponent, AttendanceAddPage

  ],
  imports: [
    BrowserModule, AngularFirestoreModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    IonicModule.forRoot(SH3),
    FormsModule,
    IonicStorageModule.forRoot(),
    AgmCoreModule.forRoot(googlemapConfig)//,
    //SelectSearchableModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SH3,
    HomePage,
    ListPage,
    Sh3Page,
    CommitteePage,
    CommitteeMemberViewPage, CommitteeMemberUpdatePage, CommitteeMemberAddPage,
    OnhomePage,
    MemberPage, MemberAddPage, MemberViewPage, MemberUpdatePage,
    PledgePage, PledgeAddPage, PledgeViewPage, PledgeUpdatePage,
    PaymentPage, PaymentAddPage, PaymentViewPage, PaymentUpdatePage,
    // AttendancePage,// AttendanceAddPage, AttendanceViewPage,AttendanceUpdatePage,
    HarelinePage, HarelineAddPage, HarelineViewPage, HarelineUpdatePage,
    RatingPage,
    LoginPage, ResetpwdPage,
    SearchComponent, ListComponent, PaymentComponent, AttendanceAddPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    CallNumber,
    Camera,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DbserviceProvider,
    AngularFireAuth, AuthService //,
    //SocialSharing

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
