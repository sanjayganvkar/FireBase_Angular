import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/defer';
import 'rxjs/add/operator/mergeMap';
 
import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
 

@Injectable()
export class AuthService {

  loading: any;

  currentUser: Observable<any> = null;

  authState: any;
  isLoggedIn: boolean = false;

  constructor( public afAuth: AngularFireAuth, private afs: AngularFirestore,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
    console.log('AuthService constructor');

    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });

  }

  loginUser(mb_email_id: string, mb_password: string) {
    console.log("LoginPage loginUser  ");
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
    return Observable.defer(() => Observable.fromPromise(this.afAuth.auth.signInWithEmailAndPassword(mb_email_id, mb_password).
      catch(error => {
        this.isLoggedIn = false;

        this.currentUser = null;

        console.log("LoginPage loginUser lOGIN failed");
        this.loading.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });

      })
    )).flatMap
      (authData => this.getMember(authData)
           );
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
  getMember(authData: any) {
    if (authData != undefined) {
      this.authState = authData;
      return this.col$$('member', ref => ref.where('mb_email_id', '==', authData.email)).take(1);
    }
    else {
      return Observable.of(null);
    }
  }

  doLogin(email: string, password: string): any {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  doLogout(): any {
    console.log('AuthService doLogout');
    this.isLoggedIn = false;

    this.currentUser = null;
    return this.afAuth.auth.signOut();
  }

  register(email: string, password: string): any {
    console.log('AuthService register');
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): any {
    console.log('AuthService resetPassword');
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }


}
