import {Injectable} from '@angular/core';
import {HttpServiceProvider} from "../http-service/http-service";
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import shortid from 'shortid';
import {LocalStorageProvider} from "../local-storage/local-storage";

@Injectable()
export class EndpointServiceProvider {

  private loggedIn: boolean;

  constructor(private http: HttpServiceProvider,
              private localStorage: LocalStorageProvider) {
  }

  /* User */

  //DONE: POST newUser <email> <password>
  newUser(email: string, password: string) {
    return this.http.post('/newUser', {
      email: email,
      password: password
    });
  }

  //DONE: POST *newPassword (user_id) <password> <new_password>
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

  //DONE: POST *newEmail (user_id) <new_email>
  newEmail(email: string) {
    return this.checkAuthExpire().then((authToken: string) => {
      return this.http.post('/newEmail', {
        new_email: email
      }, authToken);
    }).catch((error: any) => {
      throw 'Unable to send verification email.';
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
        // get values from jwt refresh token
        let decoded = jwt.decode(data.refreshToken, {complete: true});
        resolve({
          user_id: decoded.payload.user_id
        });
      }).catch((error: any) => {
        reject('Unable to login.');
      });
    });
  }

  //DONE: logoutUser
  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.loggedIn) {
        this.checkAuthExpire().then((authToken: string) => {
          // get auth information from json web token
          let authInfo = jwt.decode(authToken, {json: true});
          // remove token from server
          return this.http.post('/removeToken', {
            token_id: [authInfo.token_id]
          }, authToken);
        }).then((data: any) => {
          // remove auth from local storage
          this.http.removeAuth().then(() => {
            this.setLoginStatus(false);
            resolve();
          }).catch((error: any) => {
            reject('Unable to log out.');
          });
        }).catch((error: any) => {
          reject('Unable to remove login session from server.');
        });
      } else {
        reject('User is not logged in.');
      }
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
    return new Promise((resolve, reject) => {
      // check if the user is logged in
      if (this.loggedIn) {
        // remove user from server
        this.checkAuthExpire().then((authToken: string) => {
          return this.http.post('/removeUser', {
            password: password
          }, authToken).then((data: any) => {
            // log user out
            return this.logoutUser();
          });
        }).then((data: any) => {
          resolve('Successfully removed user');
        }).catch((error: any) => {
          reject('Unable to remove user.');
        });
      } else {
        reject('You are not logged in.')
      }
    });
  }

  /* Content */

  //DONE: POST *newContent (user_id) [<type> <title> <description> <picture>]
  newContent(content: any[] = []) {
    return new Promise((resolve, reject) => {
      // Check if there is any new content to add
      if (content.length <= 0) resolve();
      // check if user is logged in
      if (this.loggedIn) {
        // add all content to user
        this.checkAuthExpire().then((authToken: string) => {
          return this.http.post('/newContent', _.map(content, (curr) => {
            return {
              content_type: curr.type,
              title: curr.title,
              description: curr.description || '',
              picture: curr.picture || ''
            };
          }), authToken);
        }).then((data: any) => {
          resolve();
        }).catch((error: any) => {
          reject('Unable to create new content.');
        });
      } else {
        // get all content from local storage
        this.localStorage.get('Content').then((currentContent: any) => {
          // Add new values to current content
          let updatedContent = currentContent.concat(_.map(content, (curr) => {
            return {
              content_id: shortid.generate(),
              user_id: '',
              type: curr.type,
              title: curr.title,
              description: curr.description || '',
              picture: curr.picture || ''
            };
          }));
          // update local storage with content
          this.localStorage.set('Content', updatedContent).then(() => {
            resolve();
          }).catch(() => {
            // Unable to add content to local storage
            reject('Unable to add content.');
          });
        }).catch((error: any) => {
          // No content found add initial content
          return this.localStorage.set('Content', _.map(content, (curr) => {
            return {
              content_id: shortid.generate(),
              user_id: '',
              type: curr.type,
              title: curr.title,
              description: curr.description || '',
              picture: curr.picture || ''
            };
          })).then(() => {
            resolve();
          }).catch(() => {
            reject('Unable to add content.')
          });
        });
      }
    });
  }

  //DONE: POST *getContent (user_id) <[content_id]>
  getContent(content_id: string[]) {
    return new Promise((resolve, reject) => {
      if (this.loggedIn) {
        this.checkAuthExpire().then((authToken: string) => {
          return this.http.post('/getContent', {
            content_id: content_id
          }, authToken);
        }).then((data: any) => {
          resolve(data);
        }).catch((error: any) => {
          reject('Unable to get content.');
        });
      } else {
        this.localStorage.get('Content').then((content: any) => {
          let result = _.intersectionBy(content, _.map(content_id, (curr) => {
            return {
              content_id: curr
            }
          }), 'content_id');
          // return all content that match content_ids
          resolve(result);
        }).catch((error: any) => {
          reject('Unable to get content.');
        });
      }
    });
  }

  //DONE: POST *getContentByType (user_id) <content_type>
  getContentByType(type: string) {
    return new Promise((resolve, reject) => {
      if (this.loggedIn) {
        // get all user content
        this.checkAuthExpire().then((authToken: string) => {
          return this.http.post('/getContentByType', {
            content_type: type
          }, authToken);
        }).then((data: any) => {
          resolve(data);
        }).catch((error: any) => {
          reject(`Unable to get ${type}s.`);
        });
      } else {
        this.localStorage.get('Content').then((data: any) => {
          resolve(_.filter(data, ['type', type]));
        }).catch((error: any) => {
          reject(`Unable to get ${type}s.`);
        });
      }
    });
  }

  //DONE: POST *updateContent (user_id) <content_id> <content_type> <title> <description> <picture>
  updateContent(content_id: string, type: string, title: string, description: string = '', picture: string = '') {
    return new Promise((resolve, reject) => {
      if (this.loggedIn) {
        this.checkAuthExpire().then((authToken: string) => {
          return this.http.post('/updateContent', {
            content_id: content_id,
            content_type: type,
            title: title,
            description: description,
            picture: picture
          }, authToken);
        }).then((data: any) => {
          resolve(`Successfully updated ${type}.`);
        }).catch((error: any) => {
          reject('Unable to update content.')
        });
      } else {
        this.localStorage.get('Content').then((data: any) => {
          // remove all content that matches content_id
          _.pullAllBy(data, [{content_id: content_id}], 'content_id');
          data.push({
            content_id: content_id,
            type: type,
            title: title,
            description: description,
            picture: picture
          });
          return this.localStorage.set('Content', data);
        }).then(() => {
          resolve();
        }).catch((error: any) => {
          reject('Unable to update content');
        });
      }
    });
  }

  //DONE: POST *removeContent (user_id) <[content_id]>
  removeContent(content_id: string[]) {
    return new Promise((resolve, reject) => {
      if (this.loggedIn) {
        this.checkAuthExpire().then((authToken: string) => {
          return this.http.post('/removeContent', {
            content_id: content_id
          }, authToken);
        }).then((data: any) => {
          resolve('Successfully deleted content.');
        }).catch((error: any) => {
          reject('Unable to remove content.');
        });
      } else {
        this.localStorage.get('Content').then((content: any) => {
          // remove from local storage
          let result = _.differenceBy(content, _.map(content_id, (curr) => {
            return {
              content_id: curr
            };
          }), 'content_id');
          return this.localStorage.set('Content', result);
        }).then(() => {
          resolve();
        }).catch((error: any) => {
          reject('Unable to remove content.');
        });
      }
    });
  }

  // DONE: removeAllLocalContent
  removeAllLocalContent() {
    return this.localStorage.set('Content', []);
  }

  /* Auth */

  //DONE: POST newAuthToken <refreshToken>
  newAuthToken(refreshToken: string) {
    return this.http.post('/newAuthToken', {
      refreshToken: refreshToken
    }).then((data: any) => {
      return this.http.setAuth(data.refreshToken, data.authToken);
    });
  }

  //CHECK: POST *getUserTokenInfo (user_id)
  getUserTokenInfo() {
    return new Promise((resolve, reject) => {
      if (this.loggedIn) {
        this.checkAuthExpire().then((authToken: any) => {
          return this.http.post('/getUserTokenInfo', {}, authToken);
        }).then((data: any) => {
          resolve(data);
        }).catch((error: any) => {
          reject('Unable to get user token information.');
        })
      } else {
        reject('User is not logged in.')
      }
    });
    /*return this.checkAuthExpire().then((authToken: string) => {
      return this.http.post('/getUserTokenInfo', {}, authToken);
    });*/
  }

  //DONE: checkAuthExpire
  checkAuthExpire() {
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
          throw 'User is not logged in';
        }
      }).catch((error: any) => {
        this.setLoginStatus(false);
        reject(error);
      });
    });
  }

  /* Misc */

  //DONE: setLoginStatus <status>
  setLoginStatus(status: boolean) {
    this.loggedIn = status;
  }

  //DONE: getLoginStatus
  getLoginStatus() {
    return this.loggedIn;
  }

}
