import { AlertController, LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ValidationserviceProvider } from '../../providers/dbservice/validationservice';
import { Member } from '../../models/interfaces/member.model';
import { MemberPage } from '../../pages/member/member';
import { Race } from '../../models/interfaces/race.model';
import { Status } from '../../models/interfaces/status.model';
@Component({
  selector: 'page-member_add',
  templateUrl: 'member_add.html',
})
export class MemberAddPage {
  loading: any;
  race$: Observable<Race[]>;
  status$: Observable<Status[]>;
  member$: Observable<Member[]>;
  memberForm: FormGroup;
  member: Member;
  constructor(public authService: AuthService, public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private toastCtrl: ToastController
    , private db: DbserviceProvider, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
    console.log('MemberAddPage constructor');
    this.memberForm = this.formBuilder.group({
      //mb_hashname: [''],
      mb_hashname: ['',[Validators.required]],
      mb_password: ['pass4321@',[Validators.required]],
      //mb_password: ['pass4321@'],
      mb_firstname: ['',[Validators.required]],
      //mb_firstname: [''],
      mb_lastname: ['',[Validators.required]],
      //mb_lastname: [''],
      mb_email_id: ['',[Validators.required,ValidationserviceProvider.emailValidator]],
      //mb_email_id: [''],
      rc_name: [''],
      mb_gender: [''],
      mb_contact_mobile: ['+65',[Validators.required,ValidationserviceProvider.phoneValidator]],
      //mb_contact_mobile: [''],
      mb_birthdate: ['',[Validators.required]],
      //mb_birthdate: [''],
      mb_photo: ['https://firebasestorage.googleapis.com/v0/b/shhh-e5ecf.appspot.com/o/assets%2Fimage%2Fmember%2Fshhh-def.jpg?alt=media&token=406a2b30-eb85-4b69-808f-5862f6606225'],
      mb_status: ['Regular Member',[Validators.required]]
      //mb_status: ['Regular Member']
    });
  }
  ionViewDidLoad() {
    console.log('MemberAddPage ionViewDidLoad');
    this.race$ = this.db.col$$('race');
    this.status$ = this.db.col$$('status', ref => ref.orderBy('st_order'));
  }
  goback() {
    console.log('MemberAddPage goback');
    this.navCtrl.setRoot(MemberPage);
  }
  addMember(value: any) {
    console.log('MemberAddPage addMember');
    const memberValues: any = {
      uid: value.uid,
      mb_email_id: value.mb_email_id,
      mb_birthdate: value.mb_birthdate,
      mb_contact_mobile: value.mb_contact_mobile,
      mb_firstname: value.mb_firstname,
      mb_hashname: value.mb_hashname,
      mb_lastname: value.mb_lastname,
      mb_photo: value.mb_photo,
      mb_status: value.mb_status
    }

    if (this.memberForm.dirty && this.memberForm.valid) {
      this.db.add('member', memberValues);
      this.navCtrl.setRoot(MemberPage); 
    }
    
  }
  doRegister(value: any) {
    console.log('MemberAddPage doRegister');
    var nValue = value;
    this.authService.register(value.mb_email_id, value.mb_password).then(authService => {
      console.log(authService.uid);
      nValue['uid'] = authService.uid;
      this.addMember(nValue);
      this.navCtrl.setRoot(MemberPage);
    }, error => {
      this.loading.dismiss().then(() => {
        let alert = this.alertCtrl.create({
          message: error.message,
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        alert.present();
      });
    });
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
  }

  ngOnDestroy() {
    console.log('MemberAddPage ngOnDestroy');
    this.race$ = null;
  }

}
