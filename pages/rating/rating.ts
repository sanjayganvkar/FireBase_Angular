import { AlertController } from 'ionic-angular';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/dbservice/authservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Member } from '../../models/interfaces/member.model';
import { Rating } from '../../models/interfaces/rating.model';

@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {

  currentUser: Member;
  rating$: any;
  hcat$: any;
  rating: Rating;
  harelineid: string;
  ratingForm: FormGroup;
  stars = [];

  @Input() numStars: number = 5;
  @Input() readOnly: boolean = false;
  @Input() value: number = 0;

  @Output() clicked: EventEmitter<number> = new EventEmitter<number>();

  constructor(public authService: AuthService, public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, private formBuilder: FormBuilder,
    private db: DbserviceProvider
  ) {
    console.log('RatingPage constructor');
    this.ratingForm = this.formBuilder.group({
      hc_name: [''],
      hr_comment: [''],
      stars: ['']
    });

  }

  ionViewDidLoad() {
    console.log('RatingPage ionViewDidLoad');
    this.harelineid = this.navParams.get('hareline');

    this.authService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      });
  }

  ngOnInit() {
    console.log('RatingPage ngOnInit');
    this.rating$ = this.db.col$$('rating');
    this.hcat$ = this.db.col$$('harelinecategory');

    this.db.col$$('rating').subscribe(rt => {
      for (var i in rt) {
        this.calc2(rt[i].rt_name, 0);
      };
    });

  }
  ngAfterViewInit() {
    console.log('ngAfterViewInit');
  }
  goback() {
    console.log('HarelineUpdatePage goback');
    this.navCtrl.pop();
  }
  addRating(value: any) {
    console.log('RatingPage addRating');
    var ratings = {};

    Object.keys(this.stars).forEach((ratingName) => {
      let cnt = 0;
      this.stars[ratingName].forEach(element => {
        if (element == "star-half") {
          cnt = cnt + .5;
        }
        else if (element == "star") {
          cnt = cnt + 1;
        }
      });
      ratings[ratingName] = cnt;
    });

    var date = new Date().toISOString();
    const ratingValues: any = {
      mb_hashname: this.currentUser.mb_hashname,
      hr_rateddate: date,
      hr_comment: value.hr_comment,

      hc_name: value.hc_name,
      mb_photo: this.currentUser.mb_photo,
      hr_userrating: ratings
    }

    this.db.addRating(this.harelineid, ratingValues);

    this.navCtrl.pop();
  }

  calc2(ratingName: string, index: number) {
    if (this.stars[ratingName] == undefined) {
      this.stars[ratingName] = [];
      for (let i = 0; i < this.numStars; i++) {
        this.stars[ratingName].push("star-outline");
      }
    }
    else if (this.stars[ratingName] != undefined) {

      if (this.stars[ratingName][index] == "star-half") // current one is half
      {
        this.stars[ratingName][index] = "star"; // set it to full

      }
      else if (this.stars[ratingName][index] == "star") // current one is Full
      {
        this.stars[ratingName][index] = "star-outline"; // set it to empty

      }
      else if (this.stars[ratingName][index] == "star-outline") // current one is empty
      {
        this.stars[ratingName][index] = "star-half"; // set it to half
      }
      else if (this.stars[ratingName][index] == undefined) {

        this.stars[ratingName][index] = "star-half";
      }
      for (let i = 0; i < index; i++) {
        this.stars[ratingName][i] = "star";
      }

      for (let i = index + 1; i < this.numStars; i++) {
        this.stars[ratingName][i] = "star-outline";
      }
    }
  }

  starClicked(index: number, ratingName: string) {
    this.calc2(ratingName, index);
    this.clicked.emit(this.stars[ratingName]);
  }

}