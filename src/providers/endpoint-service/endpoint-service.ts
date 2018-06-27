import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {HttpServiceProvider} from "../http-service/http-service";
import {Observable} from "rxjs/Observable";
import jwt from 'jsonwebtoken';

@Injectable()
export class EndpointServiceProvider {

  private userLoggedIn = new Subject<boolean>();

  constructor(private http: HttpServiceProvider) {
    // Check if user is logged in and auth tokens are not expired
    this.checkAuthExpire().then(() => {
      // user logged in
      this.setLoginStatus(true);
    }).catch((error: any) => {
      // user not logged in
      this.setLoginStatus(false);
    });
  }

  /* User */

  //DONE: POST newUser <email> <password>
  newUser(email: string, password: string) {
    return this.http.post('/newUser', {
      email: email,
      password: password
    });
  }

  //CHECK: POST *newPassword (user_id) <password> <new_password>
  newPassword(password: string, new_password: string) {
    // check if auth tokens are still valid
    return this.checkAuthExpire().then((authToken: any) => {
      // update user password
      return this.http.post('/newPassword', {
        password: password,
        new_password: new_password
      }, authToken).then((auth: any) => {
        // update user auth tokens
        return this.http.setAuth(auth.refreshToken, auth.authToken);
      });
    });
  }

  //CHECK: POST *newEmail (user_id) <email>
  newEmail(email: string) {
    return this.checkAuthExpire().then((authToken: string) => {
      return this.http.post('/newEmail', {
        email: email
      }, authToken);
    });
  }

  //DONE: POST loginUser <email> <password>
  loginUser(email: string, password: string) {
    return new Promise((resolve, reject) => {
      // user login
      this.http.post('/loginUser', {
        email: email,
        password: password
      }).then((auth: any) => {
        // add auth tokens
        return this.http.setAuth(auth.refreshToken, auth.authToken);
      }).then((data: any) => {
        // update user login status
        this.setLoginStatus(true);
        resolve();
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  //DONE: logoutUser
  logoutUser() {
    return new Promise((resolve, reject) => {
      this.http.removeAuth().then(() => {
        this.setLoginStatus(false);
        resolve();
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  //DONE: POST *getUserInfo (user_id)
  getUserInfo() {
    return this.checkAuthExpire().then((authToken: string) => {
      return this.http.post('/getUserInfo', {}, authToken)
    });
  }

  //DONE: POST sendRecoveryEmail <email>
  sendRecoveryEmail(email: string) {
    return this.http.post('/sendRecoveryEmail', {
      email: email
    });
  }

  //CHECK: POST *removeUser (user_id) <password>
  removeUser(password: string) {
    return this.checkAuthExpire().then((authToken: string) => {
      return this.http.post('/removeUser', {
        password: password
      }, authToken);
    });
  }

  /* Content */

  //CHECK: POST *newContent (user_id) <content_type> <title> <description> <picture>
  newContent(content_type: string, title: string, description: string = '', picture: string = '') {
    return this.checkAuthExpire().then((authToken: string) => {
      return this.http.post('/newContent', {
        content_type: content_type,
        title: title,
        description: description,
        picture: picture
      }, authToken);
    });
  }

  //CHECK: POST *getContent (user_id) <[content_id]>
  getContent(content_id: string[]) {
    return this.checkAuthExpire().then((authToken: string) => {
      return this.http.post('/getContent', {
        content_id: content_id
      }, authToken);
    });
  }

  //CHECK: POST *getContentByType (user_id) <content_type>
  getContentByType(content_type: string) {
    return this.checkAuthExpire().then((authToken: string) => {
      return this.http.post('/getContentByType', {
        content_type: content_type
      }, authToken);
    });
  }

  //CHECK: POST *updateContent (user_id) <content_id> <content_type> <title> <description> <picture>
  updateContent(content_id: string, content_type: string, title: string, description: string = '', picture: string = '') {
    return this.checkAuthExpire().then((authToken: string) => {
      return this.http.post('/updateContent', {
        content_id: content_id,
        content_type: content_type,
        title: title,
        description: description,
        picture: picture
      }, authToken);
    });
  }

  //CHECK: POST *removeContent (user_id) <[content_id]>
  removeContent(content_id: string[]) {
    return this.checkAuthExpire().then((authToken: string) => {
      return this.http.post('/removeContent', {
        content_id: content_id
      }, authToken);
    });
  }

  /* Auth */

  //CHECK: POST newAuthToken <refreshToken>
  newAuthToken(refreshToken: string) {
    return this.http.post('/newAuthToken', {
      refreshToken: refreshToken
    }).then((data: any) => {
      return this.http.setAuth(data.refreshToken, data.authToken);
    });
  }

  //CHECK: POST *getUserTokenInfo (user_id)
  getUserTokenInfo() {
    return this.checkAuthExpire().then((authToken: string) => {
      return this.http.post('/getUserTokenInfo', {}, authToken);
    });
  }

  //CHECK: POST *removeToken (user_id) <[token_id]>
  removeToken(token_id: string[]) {
    return this.checkAuthExpire().then((authToken: string) => {
      return this.http.post('/removeToken', {
        token_id: token_id
      }, authToken);
    });
  }

  //DONE: checkAuthExpire
  checkAuthExpire() {
    // Math.floor(Date.now()/1000)+10 >= authToken.exp
    return new Promise((resolve, reject) => {
      this.http.getAuth().then((auth: any) => {
        // check if auth token exists
        if (auth.authToken !== '' && auth.refreshToken !== '') {
          // decode json web tokens
          let decodedRefresh = jwt.decode(auth.refreshToken);
          let decodedAuth = jwt.decode(auth.authToken);
          // check if auth token will expire in 10 seconds
          if (decodedAuth.exp <= (Math.floor(Date.now() / 1000) + 10) ||
            decodedRefresh.exp <= (Math.floor(Date.now() / 1000) + 10)) {
            // Update auth and refresh token
            return this.newAuthToken(auth.refreshToken)
            .then((data: any) => resolve(data.authToken))
            .catch((error: any) => {
              return this.http.removeAuth();
            });
          } else {
            // both auth and refresh tokens are still valid
            resolve(auth.authToken);
          }
        } else {
          throw 'user is not logged in';
        }
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  /* Misc */

  //CHECK: setLoginStatus <status>
  setLoginStatus(status: boolean) {
    this.userLoggedIn.next(status);
  }

  //CHECK: getLoginStatus
  getLoginStatus(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }

}
