import { AlertController, LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { SearchComponent } from '../../components/searchcomponent/searchcomponent';

import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Member } from '../../models/interfaces/member.model';

import { Hareline } from '../../models/interfaces/hareline.model';

@Component({
  selector: 'page-attendance_add',
  templateUrl: 'attendance_add.html',
})
export class AttendanceAddPage {

  loading: any;

  attendanceForm: FormGroup;
  member: Member;
  hareline: Hareline;

  smember = [];

  constructor(public authService: AuthService, public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private toastCtrl: ToastController
    , private db: DbserviceProvider, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, public popoverCtrl: PopoverController
  ) {
    console.log('AttendanceAddPage constructor');

    this.hareline = this.navParams.get('hareline');
    this.attendanceForm = this.formBuilder.group({
      mb_hashname: [''],
      at_confirmed: ['']
    });
  }

  ionViewDidLoad() {
    console.log('AttendanceAddPage ionViewDidLoad');
  }

  selectMember() {
    let selection = this.popoverCtrl.create(SearchComponent, { obs: 'member', sel: this.smember, type: 'c' });
    selection.present();
    selection.onDidDismiss(data => {
      if (data != null) {
        this.smember = [];
        for (var key in data) {
          this.smember.push(key);
        }
      }
    });
  }

  goback() {
    console.log('AttendanceAddPage goback');
    this.navCtrl.pop();
  }

  addAttendance(value: any) {
    console.log('AttendanceAddPage addAttendance');
    let attendees = [] = value.mb_hashname.split(',');

    for (var i in attendees) {
      let formValues = {
        hl_id: this.hareline.id,
        hl_runno: this.hareline.hl_runno,
        hl_name: this.hareline.hl_name,
        hl_datetime: this.hareline.hl_datetime,
        mb_hashname: attendees[i].mb_hashname,
        at_confirmed: value.at_confirmed
      }
      this.db.add('attendance', formValues);

    }
    this.navCtrl.pop();
  }

  ngOnDestroy() {
    console.log('AttendanceAddPage ngOnDestroy');
  }
}
