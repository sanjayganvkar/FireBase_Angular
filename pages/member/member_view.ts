import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { MemberPage } from '../../pages/member/member';
import { MemberUpdatePage } from '../../pages/member/member_update';
import { Member } from '../../models/interfaces/member.model';

@Component({
  selector: 'page-member_view',
  templateUrl: 'member_view.html',
})
export class MemberViewPage {
  currentUser: Member;
  public static readonly MEMBER_UPD_ACCESS = 'updateMember';
  public static readonly MEMBER_DEL_ACCESS = 'deleteMember';
  public static readonly PLEDGE_HL_VIEW_ACCESS = 'viewRunPledge';
  public static readonly PLEDGE_BD_VIEW_ACCESS = 'viewBirthdayPledge';
  public static readonly PAYMENT_VIEW_ACCESS = 'viewPayment';

  hasViewPaymentAccess: boolean = false;
  hasViewRunPledgeAccess: boolean = false;
  hasViewBdayPledgeAccess: boolean = false;
  hasUpdMemberAccess: boolean = false;
  hasDelMemberAccess: boolean = false;
  isPledgeVisible: boolean = false;
  isPaymentVisible: boolean = false;
  pledge$: any;
  payment = [];
  paymenttype = [];
  id: string;
  mb_email_id: string;
  mb_hashname: string;
  mb_firstname: string;
  mb_lastname: string;
  rc_name: string;
  mb_photo: string;
  mb_birthdate: string;
  mb_contact_mobile: string;
  mb_status: string;
  displayPic: boolean = false; // Suppress photos for components
  page:string = "pledge";

  constructor(private authService: AuthService, public navCtrl: NavController, public navParams: NavParams
    , public alertCtrl: AlertController, private db: DbserviceProvider
  ) {
    console.log('MemberViewPage constructor');
  }

  ionViewDidLoad() {
    console.log('MemberViewPage ionViewDidLoad');
    this.id = this.navParams.get('member').id;
    this.mb_firstname = this.navParams.get('member').mb_firstname;
    this.mb_lastname = this.navParams.get('member').mb_lastname;
    this.rc_name = this.navParams.get('member').rc_name;
    this.mb_hashname = this.navParams.get('member').mb_hashname;
    this.mb_email_id = this.navParams.get('member').mb_email_id;
    this.mb_photo = this.navParams.get('member').mb_photo;
    this.mb_status = this.navParams.get('member').mb_status;
    this.mb_birthdate = this.navParams.get('member').mb_birthdate;
    this.mb_contact_mobile = this.navParams.get('member').mb_contact_mobile;
    if (this.authService.currentUser) {
      this.authService.currentUser.subscribe(
        user => {
          this.currentUser = user;
          this.db.hasAccess(user.ro_name, MemberViewPage.MEMBER_UPD_ACCESS).subscribe(
            hasUpdMemberAccess => { this.hasUpdMemberAccess = hasUpdMemberAccess; });

          this.db.hasAccess(user.ro_name, MemberViewPage.MEMBER_DEL_ACCESS).subscribe(
            hasDelMemberAccess => { this.hasDelMemberAccess = hasDelMemberAccess; });

          this.db.hasAccess(user.ro_name, MemberViewPage.PLEDGE_HL_VIEW_ACCESS).subscribe(
            hasViewRunPledgeAccess => {
              this.hasViewRunPledgeAccess = hasViewRunPledgeAccess;
              console.error("hasViewRunPledgeAccess: " + this.hasViewRunPledgeAccess);
            });

          this.db.hasAccess(user.ro_name, MemberViewPage.PLEDGE_BD_VIEW_ACCESS).subscribe(
            hasViewBdayPledgeAccess => {
              this.hasViewBdayPledgeAccess = hasViewBdayPledgeAccess;
              console.error("hasViewBdayPledgeAccess: " + this.hasViewBdayPledgeAccess)
            });


          this.db.hasAccess(user.ro_name, MemberViewPage.PAYMENT_VIEW_ACCESS).subscribe(
            hasViewPaymentAccess => { this.hasViewPaymentAccess = hasViewPaymentAccess; });

          this.isPledgeVisible = (user.mb_hashname == this.mb_hashname ? true : false);
          console.error("isPledgeVisible: " + this.isPledgeVisible)

          this.isPaymentVisible = (user.mb_hashname == this.mb_hashname ? true : false);
          

        }
      )

      this.pledge$ = this.db.col$$('pledge', ref => ref.where('mb_hashname', '==', this.mb_hashname).orderBy('pl_date', 'desc'));
      
      this.db.col$$('payment', ref => ref.where('mb_hashname', '==', this.mb_hashname)).subscribe(x => {
        x.map(y => {
          if (this.payment[y.mb_hashname] == undefined) {
            this.payment[y.mb_hashname] = [];
          }
          this.payment[y.mb_hashname][y.py_type] = y.py_amount;
          this.payment[y.mb_hashname]['mb_photo'] = y.mb_photo;
        })
        console.error(this.payment);
      }

      );

      this.db.col$$('paymenttype', ref => ref.orderBy('py_type', 'asc')).take(1).subscribe(pt => { pt.map(yy => { this.paymenttype.push(yy.py_type) }) });

    }
  }


  launchWhasApp() {
    console.log('MemberViewPage launchWhasApp');
    window.open('whatsapp://send?phone='+ this.mb_contact_mobile+ '&text=Hi ' + this.mb_hashname , "_system", "location=yes");
  }


  launchEmail() {
    console.log('MemberViewPage launchEmail');
    window.open('mailto:' + this.mb_email_id, '_system');

  }

  launchPhoneCall() {
    console.log('MemberViewPage launchPhoneCall');
    var call = "tel:" + this.mb_contact_mobile;
    //alert('Calling ' + call ); //Alert notification is displayed on mobile, so function is triggered correctly!
    document.location.href = call;
  }



  ngOnDestroy() {
    console.log('MemberViewPage ngOnDestroy');
    this.navCtrl.push(MemberPage);
  }
  deleteMember(id: any) {

    console.log('MemberViewPage deleteMember');

    this.showConfirm("Member", "Do you want to delete the Member?", id);


    //this.navCtrl.pop();

  }
  updateMember(id: any) {

    console.log('MemberViewPage updateMember');

    const formValues: any = {
      id: this.id,
      mb_firstname: this.mb_firstname,
      mb_hashname: this.mb_hashname,
      mb_lastname: this.mb_lastname,
      rc_name: this.rc_name,
      mb_email_id: this.mb_email_id,
      mb_photo: this.mb_photo,
      mb_birthdate: this.mb_birthdate,
      mb_contact_mobile: this.mb_contact_mobile,
      mb_status: this.mb_status
    }

    this.navCtrl.push(MemberUpdatePage, {
      member: formValues
    });


  }

  showConfirm(title: string, message: string, id: string) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.db.delete('member', id);
            this.navCtrl.setRoot(MemberPage);
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
