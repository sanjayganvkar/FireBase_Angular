import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ValidationserviceProvider } from '../../providers/dbservice/validationservice';
import { MemberPage } from '../../pages/member/member';
import { Race } from '../../models/interfaces/race.model';
import { Status } from '../../models/interfaces/status.model';

@Component({
  selector: 'page-member_update',
  templateUrl: 'member_update.html',
})
export class MemberUpdatePage {
  race$: Observable<Race[]>;
  status$: Observable<Status[]>;
  id: string;
  mb_email_id: string;
  mb_hashname: string;
  mb_firstname: string;
  mb_lastname: string;
  rc_name: string;
  mb_status: string;
  mb_photo: string;
  mb_contact_mobile: string;
  mb_birthdate: string;
  memberForm: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private db: DbserviceProvider, private camera: Camera, private alertCtrl: AlertController, private toastCtrl: ToastController
  ) {
    console.log('MemberUpdatePage constructor');
    this.race$ = this.db.col$$('race');
    this.status$ = this.db.col$$('status');
    this.id = this.navParams.get('member').id;
    this.mb_email_id = this.navParams.get('member').mb_email_id;
    this.mb_hashname = this.navParams.get('member').mb_hashname;
    //this.mb_firstname = [this.navParams.get('member').mb_firstname,[Validators.required]];
    this.mb_firstname = this.navParams.get('member').mb_firstname;
    this.mb_lastname = this.navParams.get('member').mb_lastname;
    this.rc_name = this.navParams.get('member').rc_name;
    this.mb_status = this.navParams.get('member').mb_status;
    this.mb_contact_mobile = this.navParams.get('member').mb_contact_mobile;
    this.mb_birthdate = this.navParams.get('member').mb_birthdate;
    this.mb_photo = this.navParams.get('member').mb_photo;
    this.memberForm = this.formBuilder.group({
      mb_hashname: [this.mb_hashname, [Validators.required]],
      mb_firstname: [this.mb_firstname, [Validators.required]],
      mb_lastname: [this.mb_lastname, [Validators.required]],
      mb_email_id: [this.mb_email_id, [Validators.required]],
      mb_status: [this.mb_status, [Validators.required]],
      mb_contact_mobile: [this.mb_contact_mobile, [Validators.required, ValidationserviceProvider.phoneValidator]],
      mb_birthdate: [this.mb_birthdate, [Validators.required]],
      mb_photo: [this.mb_photo]

    });
  }

  ionViewDidLoad() {
    console.log('MemberUpdatePage ionViewDidLoad');
  }

  ngOnDestroy() {
    console.log('MemberUpdatePage ngOnDestroy');
    this.race$ = null;
    this.status$ = null;
  }

  DeletePicture() {
    let confirm = this.alertCtrl.create({
      title: 'Delete Picture',
      message: 'Do you really want to delete the picture?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            alert("Photo deleted")
          }
        }
      ]
    });
    confirm.present();
  }

  launchCamera() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      //this.mb_photo = 'data:image/jpeg;base64,' + imageData;

      var xx = 'data:image/jpeg;base64,' + imageData;
      let storageRef = firebase.storage().ref();
      // Create a timestamp as filename
      const filename = this.mb_hashname;

      // Create a reference to 'images/todays-date.jpg'
      const imageRef = storageRef.child(`assets/imagetest/${filename}.jpg`);
      imageRef.putString(xx, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
        // Do something here when the data is succesfully uploaded!
        this.sendNotification('Do something here when the data is succesfully uploaded!');
      });
    }, (err) => {
      this.sendNotification(err);
    });
  }

  goback() {
    console.log('MemberUpdatePage goback');
    this.navCtrl.setRoot(MemberPage);
  }

  updateMember(id: string, value: any) {

    console.log('MemberUpdatePage updateMember');
    const formValues: any = {
      mb_firstname: value.mb_firstname,
      mb_hashname: value.mb_hashname,
      mb_lastname: value.mb_lastname,
      mb_email_id: value.mb_email_id,
      mb_photo: value.mb_photo,
      mb_status: value.mb_status,
      mb_contact_mobile: value.mb_contact_mobile,
      mb_birthdate: value.mb_birthdate
    }

    this.db.update('member', id, formValues);
    this.db.updateMemberDependencies(formValues);

    this.navCtrl.setRoot(MemberPage);
  }

  sendNotification(message: string): void {
    let notification = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    notification.present();
  }
}
