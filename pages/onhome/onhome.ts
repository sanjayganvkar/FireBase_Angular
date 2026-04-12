import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-onhome',
  templateUrl: 'onhome.html',
})
export class OnhomePage {
  onHomepics: Array<{ name: string, nickName: string, period: string, imagePath: string, urlText: string, url: string }>;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.onHomepics = [
      { name: "Krishnan Amboo", nickName: "Sinna Susu", period: "10 October 1946 - 22 May 2016", imagePath: "assets/imgs/OnHome/IMG-20160523-WA0017.jpg", urlText: "", url: "" },
      { name: "Len Potter", nickName: "Taff", period: "? - 15 February 2016", imagePath: "assets/imgs/OnHome/P1010041a.JPG", urlText: "Obituary", url: "http://www.bmdsonline.co.uk/media-wales-group/obituary/potter-leonard/45312754" },
      { name: "Fred Freivogel", nickName: "Fearless F**king Fred", period: "9 August 1945 - October 2015", imagePath: "assets/imgs/OnHome/Fred Freivogel.jpg", urlText: "", url: "" },
      { name: "Charles Lin Cheow Sye", nickName: "Annabelle Chong", period: "6 September 1963 - 13 September 2015", imagePath: "assets/imgs/OnHome/Annabelle.jpg", urlText: "Tribute to Annabelle", url: "https://www.youtube.com/watch?v=O5sRrAssCek" },
      { name: "Alan Tan Seang Teik", nickName: "Kopi Tiam", period: "8 October 1952 - 15 January 2015", imagePath: "assets/imgs/OnHome/KopiTiam.jpg", urlText: "", url: "" },
      { name: "Colin Settatree", nickName: "Shit Up A Tree", period: "27 June 1930 - 3 May 2014", imagePath: "assets/imgs/OnHome/IMG-20150324-WA0004.jpg", urlText: "", url: "" },
      { name: "William Yow Song Yan", nickName: "Small Size", period: "28 September 1947 - 8 September 2013", imagePath: "assets/imgs/OnHome/Small Size.jpg", urlText: "", url: "" },
      { name: "Kulbir Singh Bajaj", nickName: "Cool Beer", period: "28 May 1943 - 16 January 2013", imagePath: "assets/imgs/OnHome/Kulbir.jpg", urlText: "", url: "" },
      { name: "Nigel Harrison", nickName: "Batman", period: "16 November 1951 - 2011", imagePath: "assets/imgs/OnHome/Batman.jpg", urlText: "", url: "" },
      { name: "Patrick Goh Cheng Soon", nickName: "", period: "? - 1 December 2008", imagePath: "assets/imgs/OnHome/Patrick.jpg", urlText: "", url: "" },
      { name: "Fatipah Anthonysamy", nickName: "Fatimah", period: "10 June 1947 - 20 December 2006", imagePath: "assets/imgs/OnHome/Fatimah.jpg", urlText: "", url: "" },
      { name: "John Wei", nickName: "John Wayne", period: "6 August 1942 - 15 October 2006", imagePath: "assets/imgs/OnHome/John Wei.jpg", urlText: "", url: "" },
      { name: "Steven Lee Chye Hock", nickName: "Steven Lee Road", period: "23 June 1948 - 26 December 2005", imagePath: "assets/imgs/OnHome/", urlText: "", url: "" },
      { name: "Lim Chuan Huat", nickName: "Blackie", period: "1934(?) - 9 November 2004", imagePath: "assets/imgs/OnHome/Blackie.jpg", urlText: "", url: "" },
      { name: "Bertie Seah Seow Hian", nickName: "", period: "19?? - 24 April 2004", imagePath: "assets/imgs/OnHome/Bertie.jpg", urlText: "", url: "" },
      { name: "Amrick Singh", nickName: "", period: "17 January 1948 - 31 December 2003", imagePath: "assets/imgs/OnHome/Amrick.jpg", urlText: "", url: "" },
      { name: "Manjit Singh Dang", nickName: "Nonok", period: "11 April 1959 - 2003", imagePath: "assets/imgs/OnHome/", urlText: "", url: "" },
      { name: "Sam Choo Teck Chee", nickName: "Snake Eater", period: "2 April 1949 - 27 May 2002", imagePath: "assets/imgs/OnHome/Snake Eater.jpg", urlText: "", url: "" },
      { name: "Mohd Jais bin Mohd", nickName: "Mohd Ali", period: "25 October 1946 - 28 June 2001", imagePath: "assets/imgs/OnHome/Zais.jpg", urlText: "", url: "" },
      { name: "Thyagarajan Shanmugam", nickName: "Tiger", period: "1945(?) - 22 March 2001", imagePath: "assets/imgs/OnHome/Tiger.jpg", urlText: "", url: "" },
      { name: "Ajmer Singh", nickName: "", period: "1946(?) - 8 January 2001", imagePath: "assets/imgs/OnHome/Ajmer.jpg", urlText: "", url: "" },
      { name: "Chan Ewing", nickName: "Gigi", period: "1940 - 200?", imagePath: "assets/imgs/OnHome/", urlText: "", url: "" },
      { name: "Andrew McDowall", nickName: "Cocksucker", period: "5 February 1946 - 2000(?)", imagePath: "assets/imgs/OnHome/Cocksucker.jpg", urlText: "", url: "" },
      { name: "Billy Wong Chee Choy", nickName: "Billy Slick", period: "19?? - 28 April 1999", imagePath: "assets/imgs/OnHome/Billy Slick.jpg", urlText: "", url: "" },
      { name: "Hans Singh Raghbeer", nickName: "Hans Solo", period: "23 December 1938 - 3 March 1999", imagePath: "assets/imgs/OnHome/Hans Solo.jpg", urlText: "", url: "" },
      { name: "Voo Boo Meng", nickName: "Ah Meng", period: "1945 (?) - 19 September 1998", imagePath: "assets/imgs/OnHome/Ah Meng.jpg", urlText: "", url: "" },
      { name: "Jogjee Singh", nickName: "Jog", period: "23 October 1947 - 13 April 1996", imagePath: "assets/imgs/OnHome/Jogjee.jpg", urlText: "", url: "" },
      { name: "Mike Croft", nickName: "Crotch", period: "25 February 1940 - 19 September 1995", imagePath: "assets/imgs/OnHome/Croft.jpg", urlText: "", url: "" },
      { name: "Amerjeet Singh", nickName: "Gunsmoke", period: "19?? - 24 July 1991", imagePath: "assets/imgs/OnHome/Gunsmoke.jpg", urlText: "", url: "" },
      { name: "Kelly Kishan", nickName: "", period: "19?? - 19??", imagePath: "assets/imgs/OnHome/", urlText: "", url: "" },
      { name: "Jack Foote", nickName: "Jackfruit", period: "19?? - 19??", imagePath: "assets/imgs/OnHome/IMG-20160816-WA0001.jpg", urlText: "", url: "" }


    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnhomePage');
  }

}
