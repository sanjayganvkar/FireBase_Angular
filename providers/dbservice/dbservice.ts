import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/first';

import { Observable } from 'rxjs/Observable';

import { Member } from '../../models/interfaces/member.model';
import { Committee } from '../../models/interfaces/committee.model';
import { CommitteeMember } from '../../models/interfaces/committee.model';
import { AuthService } from './authservice';
import { Hareline } from '../../models/interfaces/hareline.model';
import { HarelineRating } from '../../models/interfaces/hareline.model';
import { Pledge } from '../../models/interfaces/pledge.model';
import { Attendance } from '../../models/interfaces/attendance.model';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable()
export class DbserviceProvider {
  currentUser: Member;
  mPhototo = [];

  committeeCollectionRef: AngularFirestoreCollection<Committee>;
  committeeMemberCollectionRef: AngularFirestoreCollection<CommitteeMember>;
  constructor(public authService: AuthService, private afs: AngularFirestore, private toastCtrl: ToastController) {
    console.log('DbserviceProvider constructor');

    if (this.authService.currentUser) {
      this.authService.currentUser.subscribe(
        user => {
          this.currentUser = user;
        }
      )
    }
  }
  col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  col$$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<any[]> {
    console.log('DbserviceProvider col$$ -> ' + ref);

    return this.col(ref, queryFn).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data as {} };
      });
    });
  }

  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref).snapshotChanges().map(doc => {
      return doc.payload.data() as T;
    });
  }

  add<T>(ref: CollectionPredicate<T>, data) {
    console.log('DbserviceProvider add for ' + ref);
    if (this.authService.currentUser) {
      this.authService.currentUser.take(1).subscribe(
        user => {
          this.currentUser = user;
          this.col(ref).add({
            ...data,
            createdAt: new Date(),
            createdBy: this.currentUser.mb_hashname,
            updatedAt: new Date(),
            updatedBy: this.currentUser.mb_hashname
          });
          this.sendNotification(ref + " added successfully!");

          this.col(ref + "_audit").add({
            ...data,
            createdAt: new Date(),
            createdBy: this.currentUser.mb_hashname,
            updatedAt: new Date(),
            updatedBy: this.currentUser.mb_hashname
          });

        }
      )
    }

  }

  update<T>(ref: CollectionPredicate<T>, id, data) {
    console.log('DbserviceProvider update for ' + ref);
    if (this.authService.currentUser) {
      this.authService.currentUser.take(1).subscribe(
        user => {
          this.currentUser = user;
          this.col(ref).doc(`${id}`).update({
            ...data
          });
          this.col(ref + "_audit").add({
            ...data,

            updatedAt: new Date(),
            updatedBy: this.currentUser.mb_hashname
          });

        }
      )
    }
    this.sendNotification(ref + " updated successfully!");
  }

  set<T>(ref: CollectionPredicate<T>, id, data) {
    console.log('DbserviceProvider set for ' + ref);
    if (this.authService.currentUser) {
      this.authService.currentUser.take(1).subscribe(
        user => {
          this.currentUser = user;
          this.col(ref).doc(`${id}`).set({
            ...data,
            updatedAt: new Date(),
            updatedBy: this.currentUser.mb_hashname
          }, { merge: true });

          this.col(ref + "_audit").add({
            ...data,

            updatedAt: new Date(),
            updatedBy: this.currentUser.mb_hashname
          });
        }
      )
    }
    this.sendNotification(ref + " set successfully!");
  }

  delete<T>(ref: CollectionPredicate<T>, id) {
    console.log('DbserviceProvider delete');
    this.sendNotification(ref + " deleted successfully!");
    return this.col(ref).doc(`${id}`).delete();
  }

  inspectDoc(ref: DocPredicate<any>): void {
    const tick = new Date().getTime()
    this.doc(ref).valueChanges()
      .take(1)
      .do(d => {
        const tock = new Date().getTime() - tick
        //  console.log(`Loaded Document in ${tock}ms`, d)
      })
      .subscribe()
  }

  inspectCol(ref: CollectionPredicate<any>): void {
    const tick = new Date().getTime()
    this.col(ref).valueChanges()
      .take(1)
      .do(c => {
        const tock = new Date().getTime() - tick
        // console.log(`Loaded Collection in ${tock}ms`, c)
      })
      .subscribe()
  }
  setHareCount() {

    console.log('DbserviceProvider setHareCount');
    this.col$$('config').subscribe(cfg => {
      this.col$$('hareline', ref => ref.where('hl_datetime', '>=', cfg[0].active_year)).
        subscribe(hl => {
          hl.map(dd => {
            if (dd.hl_hare.length > 0) {

              let x = dd.hl_hare.split(',');
              x.forEach(element => {
                //console.log(element);
              });
            }
          })
        })
    });
  }


  getCommitteeMemberCollection(id: string) {
    console.log('DbserviceProvider getCommitteeMemberCollection');
    this.committeeMemberCollectionRef = this.afs.doc<Committee>('committee/' + id).collection<CommitteeMember>('co_member');
    return this.afs.doc<Committee>('committee/' + id).collection<CommitteeMember>('co_member', ref => ref.orderBy('cm_sort', 'asc')).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as CommitteeMember;
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }

  getUserRatingCollection(id: string) {
    console.log('DbserviceProvider getUserRatingCollection');
    return this.afs.doc<Hareline>('hareline/' + id).collection<HarelineRating>('hl_rating').snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();// as HarelineRating;
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }

  getHarelinePledgeCollection(id: string) {
    console.log('DbserviceProvider getHarelinePledgeCollection');
    return this.afs.doc<Hareline>('hareline/' + id).collection<Pledge>('hl_pledge', ref => ref.orderBy('pl_date', 'desc')).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Pledge;
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }

  hasAccess(userRoles: string[], privilege: string): Observable<boolean> {
    var matched: boolean = false;
    let vR = this.col$$('privilegerole', ref => ref.where('pv_name', '==', privilege)).take(1);
    return vR.map
      (privroles => {
        userRoles.map(usrrole => {
          if ((typeof privroles[0] != "undefined") && (typeof privroles[0].pv_role != "undefined")) {
            if (privroles[0].pv_role.indexOf(usrrole) > -1 || usrrole.indexOf('Admin') > -1) {
              matched = true;
            }
          }
          else {
            matched = false;
          }
        });
        return matched;
      });
  }

  getMemberbyUid(uid: any) {
    console.log('DbserviceProvider getMemberbyUid ' + uid);
    let userRef = this.afs.collection<Member>('member', ref => ref.where('uid', '==', uid));
    return userRef.snapshotChanges().take(1).map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Member;
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }

  addCommitteeMember(value: any) {
    console.log('DbserviceProvider addCommitteeMember');
    this.sendNotification("CommitteeMember added successfully!");
    this.update('member', value.ref_mb, { ro_name: value.ro_name, mb_iscomm_mbr: true });
    return this.committeeMemberCollectionRef.add(value);
  }

  addAttendance(hareline: Hareline, attendees: Attendance[]) {
    console.log('DbserviceProvider addAttendance for hareline ' + hareline.id);
    let subs = this.col$$('attendance', ref => ref.where('hl_id', '==', hareline.id)).take(1).
      subscribe(at => {
        at.map(atdoc => {
          console.error('Observer got deleted: ');
          if (attendees !== null) {
            this.afs.doc<Attendance>('attendance/' + atdoc.id).delete();
          }
        }
        )
      },
      err => { console.error('Observer got an error: ' + err) },
      () => {
        console.log('Observer got completed: ');
        for (var i in attendees) {
          let formValues = {
            hl_id: hareline.id,
            hl_runno: hareline.hl_runno,
            hl_name: hareline.hl_name,
            hl_datetime: hareline.hl_datetime,
            mb_hashname: attendees[i].mb_hashname,
            mb_photo: attendees[i].mb_photo,
            at_confirmed: 'Confirmed'
          }
          this.add('attendance', formValues);
        }
      }
      );
  }

  addRating(id: string, value: any) {
    console.log('DbserviceProvider addRating ' + id);
    this.sendNotification("Rating added successfully!");

    Object.keys(value.hr_userrating).forEach(key => {
      var hashname = value.mb_hashname;
      var rating = value.hr_userrating[key];
      var val = new Object;
      val[hashname] = rating;
      this.afs.collection<Hareline>('hareline').doc(`${id}`).collection('hl_rating')
        .doc(key).set(val, { merge: true });
    }
    );
    var val = new Object;
    val['hc_name'] = value.hc_name;
    this.afs.collection<Hareline>('hareline').doc(`${id}`).collection('hl_rating_cat')
      .doc(value.mb_hashname).set(val, { merge: true });

    val = new Object;
    val['hr_comment'] = value.hr_comment;

    this.afs.collection<Hareline>('hareline').doc(`${id}`).collection('hl_rating_comment')
      .doc(value.mb_hashname).set(val, { merge: true });
  }

  updateCommitteeMember(id: string, value: any) {
    console.log('DbserviceProvider updateCommitteeMember ****** ' + value.ref_mb);
    this.update('member', value.ref_mb, { ro_name: value.ro_name });
    this.committeeMemberCollectionRef.doc(`${id}`).update(value);
    this.sendNotification("CommitteeMember updated successfully!");
  }

  deleteCommitteeMember(id: string, ref_mb: string) {
    console.log('DbserviceProvider deleteCommitteeMember');
    this.update('member', ref_mb, { ro_name: '', mb_iscomm_mbr: false });
    this.committeeMemberCollectionRef.doc(`${id}`).delete();
    this.sendNotification("CommitteeMember deleted successfully!");
  }

  deleteHarelineRating(harelineId: string, ratingId: string) {
    console.log('DbserviceProvider deleteHarelineRating');
    this.afs.collection<Hareline>('hareline').doc(`${harelineId}`).collection('hl_rating').doc(`${ratingId}`).delete();
    this.sendNotification("HarelineRating deleted successfully!");
  }

  sendNotification(message: string): void {
    let notification = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    notification.present();
  }

  addData() {
    //this.addPrivs();
    //this.addMember();
    //this.addHareline();
    //this.addPledges();
    //this.addPayment();
    //this.updatePMemberUrl();
    // this.updateBirthdate();
    //   this.updateMemberUrl();
    //this.updateonHome();
   // this.updatePaymentCoid();
  }


  updateRecord<T>(ref: CollectionPredicate<T>, id, data) {
    console.log('updateRecord set for ' + ref + 'id' + data);
    this.col(ref).doc(`${id}`).set({
      ...data
    }, { merge: true });
    this.sendNotification(ref + " set successfully!");
  }

  updateBirthdate() {
    let list = [
      { mb_hashname: 'Winnie the Pooh', mb_birthdate: '1949-06-06T06:11:00Z', mb_contact_mobile: '+6590694025' },
      { mb_hashname: 'Woodstock', mb_birthdate: '1950-12-29T06:11:00Z', mb_contact_mobile: '+6597514824' }
    ];

    list.forEach(x => {
      console.error(x.mb_hashname, x.mb_birthdate);
      this.col$$('member', ref => ref.where('mb_hashname', '==', x.mb_hashname)).take(1).subscribe
        (mb => {
          this.updateRecord('member', mb[0].id, { 'mb_birthdate': x.mb_birthdate, 'mb_contact_mobile': x.mb_contact_mobile });
        });
    });
  }
  updateonHome() {
    let list = [
      { oh_hashname: 'Patrick', oh_imagename: 'https://firebasestorage.googleapis.com/v0/b/shhh-e5ecf.appspot.com/o/assets%2Fimage%2Fonhome%2FPatrick.jpg?alt=media&token=813d2507-9a16-4bdb-8497-b1497075b974' },
      { oh_hashname: 'Ajmer', oh_imagename: 'https://firebasestorage.googleapis.com/v0/b/shhh-e5ecf.appspot.com/o/assets%2Fimage%2Fonhome%2FAjmer.jpg?alt=media&token=64f67eb3-303f-4db6-a4d6-eb4b6a6b7242' }

    ];

    list.forEach(x => {
      console.error(x.oh_hashname, x.oh_imagename);
      this.col$$('onhome', ref => ref.where('oh_hashname', '==', x.oh_hashname)).take(1).subscribe
        (mb => {
          this.updateRecord('onhome', mb[0].id, { 'oh_imagename': x.oh_imagename });
        });
    });
  }

  updatePaymentCoid()
  {
    this.col$$('payment').subscribe(at => {
      at.map(mb => {
        console.error('mbHashname', mb.mb_hashname, 'payment', mb.id);
        this.updateRecord('payment', mb.id, { 'co_id': 1 });
      }
      )
    }
      ,
      error => {
        // this.sendNotification("Error while updating payment for " + data.mb_hashname);
        console.error('Error mbHashname');
      }
    );

  }

  updateMemberDependencies(data) {
    this.col$$('payment', ref => ref.where('mb_hashname', '==', data.mb_hashname)).subscribe(at => {
      at.map(mb => {
        this.updateRecord('payment', mb.id, { 'mb_photo': data.mb_photo, 'mb_status': data.mb_status });
      }
      )
    }
      ,
      error => {
        this.sendNotification("Error while updating payment for " + data.mb_hashname);
      }
    );

    this.col$$('attendance', ref => ref.where('mb_hashname', '==', data.mb_hashname)).subscribe(at => {
      at.map(mb => {
        this.updateRecord('attendance', mb.id, { 'mb_photo': data.mb_photo, 'mb_status': data.mb_status });
      }
      )
    }
      ,
      error => {
        this.sendNotification("Error while updating attendance for " + data.mb_hashname);
      }
    );

    this.col$$('pledge', ref => ref.where('mb_hashname', '==', data.mb_hashname)).subscribe(at => {
      at.map(mb => {
        this.updateRecord('pledge', mb.id, { 'mb_photo': data.mb_photo, 'mb_status': data.mb_status });
      }
      )
    }
      ,
      error => {
        this.sendNotification("Error while updating pledge for " + data.mb_hashname);
      }
    );


  }

  addPledges() {
    var seqCollection = this.afs.collection('pledge');

  }
  addMember() {
    var seqCollection = this.afs.collection('member');

  }

  addHareline() {
    var seqCollection = this.afs.collection('hareline');
    
    

      }

  addPrivs() {
    var seqCollection = this.afs.collection('privilegerole');

  }
}
