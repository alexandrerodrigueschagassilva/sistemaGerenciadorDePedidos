import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
//import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  constructor(public auth: AngularFireAuth) {}

  login(email, senha) {
    return this.auth.signInWithEmailAndPassword(email, senha);
  }

  getCurrentUser() {
    return this.auth.user;
  }

  updatePassword(newPassword) {
    this.auth.currentUser.then((user) => {
      user.updatePassword(newPassword).then(() => {return true}).catch((e) => {return false});
    })
  }

  logOut(){
    this.auth.signOut();
  }
}
