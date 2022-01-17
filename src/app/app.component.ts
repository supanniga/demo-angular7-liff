import { Component, DoCheck, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Config } from '@liff/types';
import liff from '@line/liff';
import * as semver from 'semver';
export interface OpenWindowParams {
  url: string;
  external?: boolean;
}

interface Friendship {
  friendFlag: boolean;
}

interface Profile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  auth_time?: number;
  nonce?: string;
  amr?: string[];
  name?: string;
  picture?: string;
  email?: string;
}

export type Permission = 'profile' | 'chat_message.write' | 'openid' | 'email';

interface LiffError {
  code: string;
  message: string;
}

interface PermissionStatus {
  state: 'granted' | 'prompt' | 'unavailable';
}

enum CompareVersion {
  EQUAL = 0,
  GREATER_THAN = 1,
  LESS_THAN = -1,
  UNKNOWN = 99,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, DoCheck {

  title = 'demo-angular7-liff';

  liffId: string = '1656803607-GKLVjq34';

  config: Config = {
    liffId: this.liffId,
  }

  obj: {} = {};

  profile: Profile = {
    displayName: 'test',
    statusMessage: 'test',
    userId: 'test',
    pictureUrl: 'test',
  }

  friendship: Friendship = {
    friendFlag: false,
  }

  isLoggedIn: boolean;
  isInClient: boolean;
  isSubWindow: boolean;
  id: string;
  aId: any;
  accessToken: string;
  idToken: string | null = null;
  decodedIdToken: JWTPayload | null = null;
  os: any;
  language: any;
  isVideoAutoPlay: boolean;
  lineVersion: string;
  version: string;
  context: any;
  email: string;

  myPermission: any[] = [];
  permissions: Permission[] = ['profile', 'chat_message.write', 'openid', 'email'];

  constructor(private snackBar: MatSnackBar) {
    this.logCallFunction('constructor');
    // liff.scanCode();
    // liff.scanCodeV2();
    // liff.subWindow;
    // liff.use;
  }


  ngDoCheck(): void {
  }

  ngOnInit(): void {
    this.logCallFunction('ngOnInit');
    this.beforeLiffInit();
    this.initLiff();
    this.afterLiffInit();
  }

  beforeLiffInit() {
    this.logCallFunction('beforeLiffInit');
    const promiseOf = 'ready';
    liff.ready.then((data) => {
      this.logThen(promiseOf, data);
    }).catch((error: Error) => {
      this.logCatch(promiseOf, error);
    }).finally(() => {
      this.logFinally(promiseOf);
    });
    this.os = liff.getOS();
    this.language = liff.getLanguage();
    this.version = liff.getVersion();
    this.lineVersion = liff.getLineVersion();
    this.isInClient = liff.isInClient();
  }

  initLiff() {
    this.logCallFunction('initLiff');
    // liff.init(this.config, this.successCallback, this.errorCallback);
    const promiseOf = 'init';
    liff.init({
      liffId: this.liffId, // Use own liffId
    }).then((data) => {
      this.logThen(promiseOf, data);
    }).catch((error: Error | LiffError) => {
      this.logCatch(promiseOf, error);
    }).finally(() => {
      this.logFinally(promiseOf);
    });

    if (liff.isLoggedIn()) {
      this.getPerrmission();
    } else {
      // this.login();

    }
  }

  successCallback(): void {
    console.log(555);
  }

  errorCallback(error: Error): void {
    console.log(888, error);
  }

  afterLiffInit() {
    this.logCallFunction('afterLiffInit');
    this.isLoggedIn = liff.isLoggedIn();
    this.isSubWindow = liff.isSubWindow();
    this.id = liff.id;
    this.aId = liff.getAId();
    this.accessToken = liff.getAccessToken();
    this.idToken = liff.getIDToken();
    this.decodedIdToken = liff.getDecodedIDToken();
    this.isVideoAutoPlay = liff.getIsVideoAutoPlay();
    this.context = liff.getContext();
    // this.email = this.decodedIdToken.email;
    this.obj = {
      'isLoggedIn': this.isLoggedIn,
      'isInClient': this.isInClient,
      'isSubWindow': this.isSubWindow,
      'id': this.id,
      'aId': this.aId,
      'accessToken': this.accessToken,
      'idToken': this.idToken,
      'decodedIdToken': this.decodedIdToken,
      'os': this.os,
      'language': this.language,
      'isVideoAutoPlay': this.isVideoAutoPlay,
      'lineVersion': this.lineVersion,
      'version': this.version,
      'context': this.context,
      // 'email': this.email
    }
  }

  compareVersion(version1: string, version2: string): CompareVersion {
    const result: -1 | 0 | 1 = semver.compare(version1, version2);
    if (result === 0) {
      console.log(`${version1} == ${version2}`, CompareVersion.EQUAL.valueOf());
      return CompareVersion.EQUAL;
    } else if (result === 1) {
      console.log(`${version1} > ${version2}`, CompareVersion.GREATER_THAN.valueOf());
      return CompareVersion.GREATER_THAN;
    } else if (result === -1) {
      console.log(`${version1} < ${version2}`, CompareVersion.LESS_THAN.valueOf());
      return CompareVersion.LESS_THAN;
    } else {
      return CompareVersion.UNKNOWN;
    }
  }

  login() {
    this.logCallFunction('login');
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  }

  logout(): void {
    this.logCallFunction('logout');
    if (liff.isLoggedIn()) {
      liff.logout();
      window.location.reload();
    }
  }

  // OpenWindowParams
  openWindow(url: string, isExternal: boolean): void {
    this.logCallFunction('openWindow');
    const params: OpenWindowParams = {
      url: url,
      external: isExternal,
    }
    liff.openWindow(params);
  }

  closeWindow(): void {
    this.logCallFunction('closeWindow');
    const compareLiffVersion: CompareVersion = this.compareVersion(this.version, '2.4.0');
    const compareLineVersion: CompareVersion = this.compareVersion(this.lineVersion, '10.15.0');
    console.log(compareLiffVersion);
    console.log(compareLineVersion);
    if ((compareLiffVersion.valueOf() === CompareVersion.EQUAL) || (compareLiffVersion.valueOf() === CompareVersion.GREATER_THAN)) {

    }
    liff.closeWindow();
  }

  getPerrmission() {
    this.logCallFunction('getPerrmission');
    this.permissions.forEach((permission) => {
      const promiseOf = `permission.${permission}`;
      liff.permission.query(permission).then((permissionStatus: PermissionStatus) => {
        console.log(permission, permissionStatus);
        this.myPermission.push({
          permission: permission,
          permissionStatusState: permissionStatus.state,
        });
        switch (permission) {
          case 'profile': {
            switch (permissionStatus.state) {
              case 'granted': {
                this.getProfile();
                break;
              }
              case 'prompt': {
                liff.permission.requestAll();
                break;
              }
              case 'unavailable': {
                //statements; 
                break;
              }
              default: {
                //statements; 
                break;
              }
            }
            break;
          }
          case 'openid': {
            switch (permissionStatus.state) {
              case 'granted': {
                //statements; 
                break;
              }
              case 'prompt': {
                //statements; 
                break;
              }
              case 'unavailable': {
                //statements; 
                break;
              }
              default: {
                //statements; 
                break;
              }
            }
            break;
          }
          case 'email': {
            switch (permissionStatus.state) {
              case 'granted': {
                //statements; 
                break;
              }
              case 'prompt': {
                //statements; 
                break;
              }
              case 'unavailable': {
                //statements; 
                break;
              }
              default: {
                //statements; 
                break;
              }
            }
            break;
          }
          case 'chat_message.write': {
            switch (permissionStatus.state) {
              case 'granted': {
                //statements; 
                break;
              }
              case 'prompt': {
                //statements; 
                break;
              }
              case 'unavailable': {
                //statements; 
                break;
              }
              default: {
                //statements; 
                break;
              }
            }
            break;
          }
          default: {
            //statements; 
            break;
          }
        }
      }).catch((error: Error | LiffError) => {
        this.logCatch(promiseOf, error);
      }).finally(() => {
        this.logFinally(promiseOf);
      });
    });
  }


  // Promise<Profile>
  getProfile(): void {
    this.logCallFunction('getProfile');
    const promisOf = 'getProfile'
    liff.getProfile().then((data) => {
      this.logThen(promisOf, data);
      localStorage.setItem('profile', JSON.stringify(data));
      this.setProfile(data);
    }).catch((error: Error | LiffError) => {
      this.logCatch(promisOf, error);
    }).finally(() => {
      this.logFinally(promisOf);
    });
  }

  setProfile(data: Profile) {
    this.profile.displayName = data.displayName;
    this.profile.pictureUrl = data.pictureUrl;
    this.profile.statusMessage = data.statusMessage;
    this.profile.userId = data.userId;
  }

  // Promise<Friendship>
  getFriendship(): void {
    this.logCallFunction('getFriendship');
    const promiseOf = 'getFriendship';
    liff.getFriendship().then((data) => {
      this.logThen(promiseOf, data);
      this.friendship.friendFlag = data.friendFlag;
      if (data.friendFlag) {
        // something you want to do
      }
    }).catch((error: Error | LiffError) => {
      this.logCatch(promiseOf, error);
    }).finally(() => {
      this.logFinally(promiseOf);
    });
  }



  permanentLink() {
    // For example, if the endpoint URL of the LIFF app
    // is https://example.com/path1?q1=v1
    // and its LIFF ID is 1234567890-AbcdEfgh
    liff.permanentLink
      .createUrlBy('https://example.com/path1?q1=v1')
      .then((permanentLink) => {
        // https://liff.line.me/1234567890-AbcdEfgh
        console.log(permanentLink);
      });

    liff.permanentLink
      .createUrlBy('https://example.com/path1/path2?q1=v1&q2=v2')
      .then((permanentLink) => {
        // https://liff.line.me/1234567890-AbcdEfgh/path2?q=2=v2
        console.log(permanentLink);
      });

    // For example, if current location is
    // /shopping?item_id=99#details
    // (LIFF ID = 1234567890-AbcdEfgh)
    const myLink = liff.permanentLink.createUrl()

    // myLink equals "https://liff.line.me/1234567890-AbcdEfgh/shopping?item_id=99#details"


    // For example, if current location is
    // /food?menu=pizza
    // (LIFF ID = 1234567890-AbcdEfgh)
    liff.permanentLink.setExtraQueryParam('user_tracking_id=8888')
    const myLink2 = liff.permanentLink.createUrl()


    // myLink equals "https://liff.line.me/1234567890-AbcdEfgh/food?menu=pizza&user_tracking_id=8888"
  }

  initLiffPlugins() {
    liff.initPlugins(['bluetooth']).then(() => {
      // liffCheckAvailablityAndDo(() => liffRequestDevice());
    }).catch(error => {
      console.log(error);
    });
  }

  sendMessages() {
    const promiseOf = 'sendMessages';
    liff.sendMessages([
      {
        type: 'text',
        text: 'Hello, World!'
      }
    ]).then((data) => {
      this.logThen(promiseOf, data);
    }).catch((error: Error | LiffError) => {
      this.logCatch(promiseOf, error);
    }).finally(() => {
      this.logFinally(promiseOf);
    });
  }

  getAdvertisingId(): Promise<string> {
    return liff.getAdvertisingId().then().catch().finally();
  }

  isApiAvailable(): boolean {
    this.isShareTargetPickerApiAvailable();
    this.isMultipleLiffTransitionApiAvailable();
    return null;
  }

  isShareTargetPickerApiAvailable(): any {
    const promiseOf = 'shareTargetPicker';
    if (liff.isApiAvailable('shareTargetPicker')) {
      liff.shareTargetPicker([
        {
          type: "text",
          text: "Hello, World!"
        }
      ]).then((data) => {
        this.logThen(promiseOf, data);
        return data;
      }).catch((error: Error | LiffError) => {
        this.logCatch(promiseOf, error);
      });
    }
  }

  isMultipleLiffTransitionApiAvailable(): any {
    const promiseOf = 'multipleLiffTransition';
    if (liff.isApiAvailable('multipleLiffTransition')) {
      window.location.href = `https://line.me/${this.liffId}`;
    }
  }

  getApi() {
    const accessToken = liff.getAccessToken();
    if (accessToken) {
      fetch("https://api...", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
        //...
      });
    }
  }

  openSnackBar(message: string, action: string) {
    const config: MatSnackBarConfig = {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    };
    this.snackBar.open(message, action, config);
  }

  logCallFunction(name: string) {
    console.log('🚀call', name);
  }

  logThen(name: string, data?: any) {
    console.log('💎then', name, data);
  }

  logCatch(name: string, error: Error | LiffError) {
    console.error(`🛑error ${name}`, error);
    if (error instanceof Error) {
      this.openSnackBar(`${error.name} ${name} : ${error.message}`, 'x');
    } else {
      this.openSnackBar(`${error.code} ${name} : ${error.message}`, 'x');
    }
  }

  logFinally(name: string) {
    console.log('🎉finally', name);
  }

  // // OS
  // getOS(): any {
  //   return liff.getOS()
  // }

  // getLanguage(): string {
  //   return liff.getLanguage();
  // }

  // // AIdInterface | undefined
  // getAId(): any | undefined {
  //   return liff.getAId();
  // }

  // getAccessToken(): string {
  //   return liff.getAccessToken();
  // }

  // // Context | null
  // getContext(): any | null {
  //   this.context = liff.getContext();
  //   return liff.getContext();
  // }

  // // JWTPayload | null
  // getDecodedIDToken(): any | null {
  //   return liff.getDecodedIDToken();
  // }

  // getIDToken(): string {
  //   return liff.getIDToken();
  // }

  // getIsVideoAutoPlay(): boolean {
  //   return liff.getIsVideoAutoPlay();
  // }

  // getLineVersion(): string {
  //   return liff.getLineVersion();
  // }

  // getProfilePlus() {
  //   return liff.getProfilePlus();
  // }

  // getVersion(): string {
  //   return liff.getVersion();
  // }

  // getId(): string {
  //   return liff.id;
  // }


  // getIsInClient(): boolean {
  //   return liff.isInClient();
  // }

  // getIsLoggedIn(): boolean {
  //   return liff.isLoggedIn();
  // }

  // getIsSubWindow(): boolean {
  //   return liff.isSubWindow();
  // }


}
