import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

 
@Component({
  selector: 'page-sh3',
  templateUrl: 'sh3.html',
})
export class Sh3Page {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Sh3Page');
  }

}
