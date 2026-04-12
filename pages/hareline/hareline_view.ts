import { AlertController } from 'ionic-angular';
import { ErrorHandler, NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { HarelinePage } from '../../pages/hareline/hareline';
import { HarelineUpdatePage } from '../../pages/hareline/hareline_update';
import { Member } from '../../models/interfaces/member.model';
import { RatingPage } from '../../pages/rating/rating';
import { PledgeAddPage } from '../../pages/pledge/pledge_add';
import { Observable } from 'rxjs/Observable';
import { Platform } from 'ionic-angular';

export interface Rrating {
  rt_name: string;
  rt_ratings: [{ mb_hashname: string, rt_value: number }]
}

@NgModule({
  imports: [
    AgmCoreModule
  ]
})

@Component({
  selector: 'page-hareline_view',
  templateUrl: 'hareline_view.html',
})

export class HarelineViewPage {

  currentUser: Member;
  public static readonly HARELINE_UPD_ACCESS = 'updateHareline';
  public static readonly HARELINE_DEL_ACCESS = 'deleteHareline';
  public static readonly RATING_UPD_ACCESS = 'updateRating';
  public static readonly PLEDGE_HL_ADD_ACCESS = 'updateRunPledge';
  public static readonly PLEDGE_BD_ADD_ACCESS = 'addRunPledge';

  hasUpdHarelineAccess: boolean = false;
  hasDelHarelineAccess: boolean = false;
  hasUpdRatingAccess: boolean = false;
  hasAddRunPledgeAccess: boolean = false;
  hasAddBdayPledgeAccess: boolean = false;

  objectKeys = Object.keys;
  id: string;
  hl_name: string;
  hl_datetime: string;
  hl_publish: boolean;
  hl_scribe: string;
  hl_hare: string;
  hl_runno: string;
  hl_runsite: string;
  hl_gps: string;
  hl_gps_lat: number;
  hl_gps_lng: number;
  hl_runtype: string;
  hl_runfee: string;
  hl_guestfee: string;
  hl_comment: string;
  member: Member;
  userRating$: any;
  pledge$: any;
  attendance$: any;

  hareline: any;

  mRating = {} as Rrating;

  mRatings = [];
  mRating$: Observable<Rrating[]>;
  public catRating: number = 0;
  public avgCatRating: number = 0;
  public totRating: number = 0;
  public avgRating: number = 0;

  constructor(private authService: AuthService, public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, private db: DbserviceProvider,  public platform: Platform
  ) {
    platform.ready().then((source) => {
      console.log("platform source " + source);
    });
    console.log('HarelineViewPage constructor');
  }

  ionViewDidLoad() {
    console.log('HarelineViewPage ionViewDidLoad');
    this.id = this.navParams.get('hareline').id;
    this.hl_name = this.navParams.get('hareline').hl_name;
    this.hl_datetime = this.navParams.get('hareline').hl_datetime;
    this.hl_publish = this.navParams.get('hareline').hl_publish;
    this.hl_scribe = this.navParams.get('hareline').hl_scribe;
    this.hl_hare = this.navParams.get('hareline').hl_hare;
    this.hl_runno = this.navParams.get('hareline').hl_runno;
    this.hl_runsite = this.navParams.get('hareline').hl_runsite;
    this.hl_gps = this.navParams.get('hareline').hl_gps;
    this.hl_gps_lat = parseFloat(this.hl_gps.split(',')[0]);
    this.hl_gps_lng = parseFloat(this.hl_gps.split(',')[1]);
    this.hl_runtype = this.navParams.get('hareline').hl_runtype;
    this.hl_runfee = this.navParams.get('hareline').hl_runfee;
    this.hl_guestfee = this.navParams.get('hareline').hl_guestfee;
    this.hl_comment = this.navParams.get('hareline').hl_comment;

    this.userRating$ = this.db.getUserRatingCollection(this.id);
    var nObjects = 0;
    let summ = this.db.getUserRatingCollection(this.id)
      .subscribe(rt => rt.map(xx => {
        this.catRating = 0;
        var nCatObjects = 0;
        Object.keys(xx).forEach(keys => {
          if (keys != "id") {
            this.totRating = this.totRating + xx[keys];
            this.catRating = this.catRating + xx[keys];
            nObjects++;
            this.avgRating = parseFloat((this.totRating / nObjects).toFixed(1));
            nCatObjects++;
            this.avgCatRating = parseFloat((this.catRating / nCatObjects).toFixed(1));
          }
          else {
            this.mRatings[xx[keys]] = parseFloat((this.avgCatRating).toFixed(1));
          }
          ;
        }
        )
      }));
    this.pledge$ = this.db.col$$('pledge', ref => ref.where('hl_id', '==', this.id));
    this.attendance$ = this.db.col$$('attendance', ref => ref.where('hl_id', '==', this.id).orderBy('at_confirmed', 'desc'));
    this.hareline = this.navParams.get('hareline');

    if (this.authService.currentUser) {
      this.authService.currentUser.subscribe(
        user => {
          this.currentUser = user;
          this.db.hasAccess(user.ro_name, HarelineViewPage.HARELINE_UPD_ACCESS).subscribe(
            hasUpdHarelineAccess => { this.hasUpdHarelineAccess = hasUpdHarelineAccess; });
          this.db.hasAccess(user.ro_name, HarelineViewPage.HARELINE_DEL_ACCESS).subscribe(
            hasDelHarelineAccess => { this.hasDelHarelineAccess = hasDelHarelineAccess; });
          this.db.hasAccess(user.ro_name, HarelineViewPage.RATING_UPD_ACCESS).subscribe(
            hasUpdRatingAccess => { this.hasUpdRatingAccess = hasUpdRatingAccess; });
          this.db.hasAccess(user.ro_name, HarelineViewPage.PLEDGE_HL_ADD_ACCESS).subscribe(
            hasAddRunPledgeAccess => { this.hasAddRunPledgeAccess = hasAddRunPledgeAccess; });
          this.db.hasAccess(user.ro_name, HarelineViewPage.PLEDGE_BD_ADD_ACCESS).subscribe(
            hasAddBdayPledgeAccess => { this.hasAddBdayPledgeAccess = hasAddBdayPledgeAccess; });
        }
      );
    }
  }

  launchNativeMap(latlong: string) {
    let label = encodeURI('RunSite');


    if (this.platform.is('ios')) {
      //console.log("running on iOS device!");
      window.open('maps://?q=' + latlong, '_system');
      //this.db.sendNotification("Platform is: ios");
    }
    else if (this.platform.is('android')) {
      //this.db.sendNotification("Platform is: android");
      window.open('geo:0,0?q=' + latlong + '(' + label + ')', '_system');
    }
    else {
      //window.open('geo:0,0?q=' + latlong + '(' + label + ')', '_system');
      //this.db.sendNotification("Platform is: Others");
      window.open('https://www.google.com/maps/search/?api=1&query='+ latlong, '_system');
      }
  }

  ngOnInit() {
    console.log('HarelineViewPage ngOnInit');
  }

  ngOnDestroy() {
    console.log('HarelineViewPage ngOnDestroy');
  }

  deleteHareline(id: any) {
    console.log('HarelineViewPage deleteHareline');
    this.showConfirm("Hareline", "Do you want to delete the Hareline?", id);
  }

  updateHareline(id: any) {
    console.log('HarelineViewPage updateHareline');
    const harelineValues: any = {
      id: this.id,
      hl_name: this.hl_name,
      hl_datetime: this.hl_datetime,
      hl_publish: this.hl_publish,
      hl_scribe: this.hl_scribe,
      hl_hare: this.hl_hare,
      hl_runno: this.hl_runno,
      hl_runsite: this.hl_runsite,
      hl_gps: this.hl_gps,
      hl_runtype: this.hl_runtype,
      hl_runfee: this.hl_runfee,
      hl_guestfee: this.hl_guestfee,
      hl_comment: this.hl_comment
    }
    this.navCtrl.push(HarelineUpdatePage, {
      hareline: harelineValues
    });
  }

  rateHareline(id: string) {
    console.log('HarelinePage rateHareline');
    this.navCtrl.push(RatingPage, {
      hareline: id
    });
  }

  addPledge(id: string) {
    console.log('HarelinePage rateHareline');
    this.navCtrl.push(PledgeAddPage, {
      hareline: this.navParams.get('hareline')
    });
  }

  addAttendance(id: string) {
    console.log('HarelinePage addAttendance');
    const attendanceValues: any = {
      hl_id: this.id,
      hl_runno: this.hl_runno,
      hl_name: this.hl_name,
      hl_datetime: this.hl_datetime,
      mb_hashname: this.currentUser.mb_hashname,
      mb_photo: this.currentUser.mb_photo,
      at_confirmed: 'Unconfirmed'
    }
    this.attendance$ = this.db.col$$('attendance', ref => ref.where('hl_id', '==', this.id).where('mb_hashname', '==', this.currentUser.mb_hashname)).take(1);
    this.attendance$.subscribe(atd => {
      if (atd.length == 0) {
        this.showAddAttendance("Attendance", "Do you want to register your attendance?", null, attendanceValues, false);
      }
      else {
        this.showAddAttendance("Attendance", "Do you want to register your attendance?", atd[0].id, attendanceValues, true);
      }
    });
  }

  deleteRating(ratingId: string) {
    console.log('HarelinePage deleteRating ' + this.id + ' ratingId ' + ratingId);
    this.showConfirmRating("Rating", "Do you want to delete the Rating?", this.id, ratingId);
  }

  showConfirm(title: string, message: string, id: string) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.db.delete('hareline', id);
            this.navCtrl.setRoot(HarelinePage);
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

  showConfirmRating(title: string, message: string, harelineId: string, ratingId: string) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.db.deleteHarelineRating(harelineId, ratingId);
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

  showAddAttendance(title: string, message: string, id: string, attendanceValues: {}, exists: boolean) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            if (exists) {
              this.db.update('attendance', id, attendanceValues);
            }
            else {
              this.db.add('attendance', attendanceValues);
            }
            this.attendance$ = this.db.col$$('attendance', ref => ref.where('hl_id', '==', this.id));
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
