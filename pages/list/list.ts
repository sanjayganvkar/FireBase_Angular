import { Component } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Member } from '../../models/interfaces/member.model';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  mbr: AngularFirestoreCollection<Member>;
  member$: Observable<Member[]>;
  member: Member;
  tmpSearchObject;
  pi_rate: number;
  objectKeys = Object.keys;

  selectedArray: {
    [index: string]: boolean;
  } = {};

  checkedMember: boolean;

  pi;
  pledgeForm: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, private afs: AngularFirestore, private db: DbserviceProvider
  ) {
    console.log('ListPage constructor');

    this.pledgeForm = this.formBuilder.group({
      mb_hashname: ['']
    });
  }

  ionViewDidLoad() {
    console.log('ListPage ionViewDidLoad');
    let va = this.getDatasnapshotChanges();
    va.subscribe(sb => {
    });
  }

  getDatasnapshotChanges() {
    console.log('ListPage getDatasnapshotChanges');
    return this.afs.collection('member').snapshotChanges().map(actions => {
      return actions.map(a => {

        if (a.payload.doc.exists) {
        }
        else {
        }
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  valueChanges() {
    console.log('ListPage getDatavalueChanges');
    return this.afs.collection('member').valueChanges().take(1);
  }

  ngOnInit() {
    console.log('ListPage ngOnInit');
    this.member$ = this.db.col$$('member');
  }
}
