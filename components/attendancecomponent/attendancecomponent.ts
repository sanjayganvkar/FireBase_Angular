import { AlertController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { Attendance } from '../../models/interfaces/attendance.model';
import { Hareline } from '../../models/interfaces/hareline.model';
import { NavController } from 'ionic-angular';

import { PopoverController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

import { ListComponent } from '../../components/listcomponent/listcomponent';
import { HarelineViewPage } from '../../pages/hareline/hareline_view';
import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Member } from '../../models/interfaces/member.model';


@Component({
  selector: 'attendancecomponent',
  templateUrl: 'attendancecomponent.html'
})
export class AttendanceComponent {
  currentUser: Member;

  @Input() hareline: Hareline;
  @Input() attendance$;

  attendees: string[] = [];

  public static readonly ATTD_UPD_ACCESS = 'updateAttendance';

  hasUpdAttendanceAccess: boolean = false;
  constructor(private authService: AuthService, public navCtrl: NavController,
    public alertCtrl: AlertController, private db: DbserviceProvider, public popoverCtrl: PopoverController,
    public modalCtrl: ModalController) {
    console.log('AttendanceComponent constructor');

    if (this.authService.currentUser) {
      this.authService.currentUser.subscribe(
        user => {
          this.currentUser = user;
          this.db.hasAccess(user.ro_name, AttendanceComponent.ATTD_UPD_ACCESS).subscribe(
            hasUpdAttendanceAccess => { this.hasUpdAttendanceAccess = hasUpdAttendanceAccess; });
        }
      )
    }
  }
  ionViewDidLoad() {
    console.log('AttendanceComponent ionViewDidLoad');

  }
  viewAttendance(attendance: Attendance) {
    console.log('AttendanceComponent viewAttendance');
  }

  addAttendance(attendees: any) {
    console.log('AttendanceAddPage addAttendance');

    this.db.addAttendance(this.hareline, attendees);
    this.navCtrl.setRoot(HarelineViewPage, {
      hareline: this.hareline
    });
  }

  selectAttendanceList(val) {
    console.log('AttendanceComponent selectAttendanceList ' + this.hareline.id);
    this.attendees = [];
    this.db.col$$('attendance', ref => ref.where('hl_id', '==',
      this.hareline.id).orderBy('at_confirmed', 'desc')).take(1)
      .subscribe(val => {
        val.map(dd => { this.attendees.push(dd.mb_hashname) });
        console.log('AttendanceComponent selectAttendanceList ttv' + this.hareline.id);
        let selection = this.modalCtrl.create(ListComponent,
          { obs: 'member', sel: this.attendees.toString() });
        selection.present();
        selection.onDidDismiss(data => {
          this.addAttendance(data);
        });
      }
      );


    console.log('AttendanceComponent selectAttendanceList jj ' + this.attendees.toString());

  }

  updateAttendance(id: string, confirmed: string) {
    console.log('AttendanceComponent updateAttendance');
    const attendanceValues: any = {
      at_confirmed: (confirmed == 'Confirmed' ? 'Unconfirmed' : 'Confirmed')
    }
    //this.showAddAttendance("Attendance", "Do you want to confirm the attendance?", id, attendanceValues);
    this.db.update('attendance', id, attendanceValues);
  }

  deleteAttendance(atId: string) {
    console.log('AttendanceComponent deleteAttendance ' + atId);
    this.db.delete('attendance', atId);
  }

  showAddAttendance(title: string, message: string, id: string, attendanceValues: {}) {

    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.db.update('attendance', id, attendanceValues);
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
