import { Component, Input } from '@angular/core';
import { Pledge } from '../../models/interfaces/pledge.model';
import { Hareline } from '../../models/interfaces/hareline.model';
import { NavController } from 'ionic-angular';
import { PledgeViewPage } from '../../pages/pledge/pledge_view';

@Component({
  selector: 'pledgecomponent',
  templateUrl: 'pledgecomponent.html'
})
export class PledgeComponent {

  @Input() pledge$: any;

  @Input() hareline: Hareline;
  @Input() displayPic: boolean;
  @Input() page$: any;

  constructor(public navCtrl: NavController) {
    console.log('PledgeComponent constructor');
  }
  viewPledge(pledge: Pledge) {
    console.log('PledgePage viewPledge');
    this.navCtrl.push(PledgeViewPage, {
      pledge: pledge
    });
  }

}
