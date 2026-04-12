import { AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Hareline } from '../../models/interfaces/hareline.model';
import { HarelineAddPage } from '../../pages/hareline/hareline_add';
import { HarelineViewPage } from '../../pages/hareline/hareline_view';
import { Member } from '../../models/interfaces/member.model';

@Component({
  selector: 'page-hareline',
  templateUrl: 'hareline.html',
})

export class HarelinePage {
  currentUser: Member;
  public static readonly HARELINE_ADD_ACCESS = 'addHareline';
  hasAddHarelineAccess: boolean = false;
  hareline$: any;
  hareline_past$: any;
  hareline: Hareline;
  showPast: boolean = false;
  showFuture: boolean = true;
  
  constructor(public authService: AuthService, public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,
    private db: DbserviceProvider, public modalCtrl: ModalController
  ) {
    console.log('HarelinePage constructor');
  }

  ngOnInit() {
    console.log('HarelinePage ngOnInit');
    var presentMonth = new Date(new Date().getFullYear(), new Date().getMonth() , new Date().getDate()).toISOString().substring(0, 10);
    var pastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 4 , new Date().getDate()).toISOString().substring(0, 10);
    console.error("presentMonth"+ presentMonth);
    console.error("pastMonth"+ pastMonth);


    this.db.setHareCount();
    this.hareline$ = this.db.col$$('hareline', ref => ref.where('hl_datetime', '>=', presentMonth).orderBy('hl_datetime', 'asc').limit(24));
    this.hareline_past$ = this.db.col$$('hareline', ref => ref.where('hl_datetime', '>=', pastMonth).where('hl_datetime', '<', presentMonth).orderBy('hl_datetime', 'asc'));
  }

  ngOnDestroy() {
    console.log('HarelinePage ngOnDestroy');
    this.hareline$ = null;
  }

  ionViewDidLoad() {
    console.log('HarelinePage ionViewDidLoad');
    if (this.authService.currentUser) {
      this.authService.currentUser.subscribe(
        user => {
          this.currentUser = user;
          this.db.hasAccess(user.ro_name, HarelinePage.HARELINE_ADD_ACCESS).subscribe(
            hasAddHarelineAccess => { this.hasAddHarelineAccess = hasAddHarelineAccess; });
        }
      )
    }
  }

  addHareline() {
    console.log('HarelinePage addHareline');
    //this.hareline$ = null;
    this.navCtrl.push(HarelineAddPage);
  }

  viewHareline(hareline: Hareline) {
    console.log('HarelinePage viewHareline');
    //  this.hareline$ = null;
    this.navCtrl.push(HarelineViewPage, {
      hareline: hareline
    });
  }

  deleteMember(id: any) {
    console.log('HarelinePage deleteMember');
    this.db.delete('member', id);
  }

  togglePast() {
    if (this.showPast == true) { this.showPast = false } else { this.showPast = true };
  }
  toggleFuture() {
    if (this.showFuture == true) { this.showFuture = false } else { this.showFuture = true };
  }
}