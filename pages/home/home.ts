import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NavController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Hareline } from '../../models/interfaces/hareline.model';
import { HarelineViewPage } from '../../pages/hareline/hareline_view';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  hareline$: any;
  hareline: Hareline;
  constructor(public navCtrl: NavController,
    private db: DbserviceProvider, public geolocation: Geolocation, public fAuth: AngularFireAuth) {
  }

  ngOnInit() {
    console.log('HomePage ngOnInit');
    var tmpdate = new Date(new Date().getFullYear(), new Date().getMonth() , new Date().getDate()-3).toISOString().substring(0, 10);
    

    this.db.col$$('hareline', ref => ref.where('hl_datetime', '>=', tmpdate).orderBy('hl_datetime', 'asc').limit(1)).take(1).subscribe(comm => {
      this.hareline = comm[0];
      this.navCtrl.setRoot(HarelineViewPage, {
        hareline: this.hareline
      });
    });
  }

  logout() {
    this.fAuth.auth.signOut();
  }
}