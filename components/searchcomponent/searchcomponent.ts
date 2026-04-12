import { Component } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Member } from '../../models/interfaces/member.model';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'searchcomponent',
  templateUrl: 'searchcomponent.html'
})
export class SearchComponent {
  ref: string = "member";  // Observable collection
  member$: Observable<Member[]>;
  member: Member;
  tmpSearchObject;
  pi_rate: number;
  objectKeys = Object.keys;
  observable$: any;
  sel = [];
  type;
  selectedArray: {
    [index: string]: boolean;
  } = {};
  checkedMember: boolean;
  pi;
  searchForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, private db: DbserviceProvider, public viewCtrl: ViewController
  ) {
    console.log('SearchComponent constructor');
    this.observable$ = this.db.col$$(navParams.get('obs'));

    this.sel = this.navParams.get('sel');
    this.type = this.navParams.get('type');
    this.sel.forEach(ind => this.selectedArray[ind] = true);

    this.searchForm = this.formBuilder.group({
      mb_hashname: ['']
    });
  }

  search(searchbar) {
    var q = searchbar.target.value;

    if (q.trim() === '') {
      this.observable$ = this.tmpSearchObject;
      return;
    }
    this.observable$ = this.observable$
      .map(arrays => arrays.filter(arrayEl => arrayEl.mb_hashname.toLowerCase().indexOf(searchbar.target.value.toLowerCase()) > -1));
  }

  setSelection(event, mbr) {
    console.log('SearchComponent setSelection');
    console.log(mbr.mb_hashname);
    console.log(event.value);

    if (event.value == true) {
      this.selectedArray[mbr.mb_hashname] = event.value;
    }
    else {
      delete this.selectedArray[mbr.mb_hashname];
    }
  }

  addHareline() {
    for (var key in this.selectedArray) {
      console.log(key + " = " + this.selectedArray[key]);
    }
    this.viewCtrl.dismiss(this.selectedArray);
  }

  goback() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('SearchComponent ionViewDidLoad');
    console.log(this.observable$); console.log(this.ref);
    this.tmpSearchObject = this.observable$;
  }

  ngOnInit() {
    console.log('SearchComponent ngOnInit');
    console.log(this.observable$); console.log(this.ref);
  }
}
