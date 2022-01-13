import { Component, DoCheck, OnInit } from '@angular/core';
import liff from '@line/liff';
import { Config } from '@liff/types';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  myPermission: any[] = [];

  constructor(private snackBar: MatSnackBar) {
    // liff.initPlugins;
    // liff.ready;
    // liff.scanCode();
    // liff.scanCodeV2();
    // liff.sendMessages;
    // liff.subWindow;
    // liff.use;
  }


  ngDoCheck(): void {
  }

  ngOnInit(): void {
    this.initLiff();
    this.getLiffData();

  }

  initLiff() {
    console.log(this.liffId, 'liffId');
    // liff.init(this.config, this.successCallback, this.errorCallback);
    liff.init({
      liffId: this.liffId, // Use own liffId
    }).then(() => {
      this.idToken = liff.getIDToken();
      console.log(liff.getIDToken(), 'idToken');
      this.decodedIdToken = liff.getDecodedIDToken();
      console.log(liff.getDecodedIDToken(), 'decodedIdToken');
    }).catch((error: Error | LiffError) => {
      this.logError('initLiff', error);
    }).finally(() => {

    });
    if (liff.isLoggedIn()) {
      this.getProfile();
    } else {
      this.login();
    }
  }

  successCallback(): void {
    console.log(555);
  }

  errorCallback(error: Error): void {
    console.log(888, error);
  }

  getLiffData() {
    this.snackBar.open('getAll', 'x', { duration: 500 })
    this.isLoggedIn = liff.isLoggedIn();
    this.isInClient = liff.isInClient();
    this.isSubWindow = liff.isSubWindow();
    this.id = liff.id;
    this.aId = liff.getAId();
    this.accessToken = liff.getAccessToken();
    this.idToken = liff.getIDToken();
    this.decodedIdToken = liff.getDecodedIDToken();
    this.os = liff.getOS();
    this.language = liff.getLanguage();
    this.isVideoAutoPlay = liff.getIsVideoAutoPlay();
    this.lineVersion = liff.getLineVersion();
    this.version = liff.getVersion();
    this.context = liff.getContext();
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
    }
  }

  login() {
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  }

  logout(): void {
    if (liff.isLoggedIn()) {
      liff.logout();
      location.reload();
    }
  }

  // OpenWindowParams
  openWindow(): void {
    const params: OpenWindowParams = {
      url: "https://line.me",
      external: true,
    }
    liff.openWindow(params);
  }

  closeWindow(): void {
    liff.closeWindow();
  }

  getPerrmission() {
    const permissions: Permission[] = ['profile', 'chat_message.write', 'openid', 'email'];
    permissions.forEach((permission) => {
      liff.permission.query('profile').then((permissionStatus: PermissionStatus) => {
        console.log(permission, permissionStatus.state);
        if (permissionStatus.state === 'granted') {
        } else if (permissionStatus.state === 'prompt') {
        } else if (permissionStatus.state === 'unavailable') {
        }
      }).catch((error: Error | LiffError) => {
        this.logError('getPerrmission', error);
      }).finally(() => {

      });
    });

    liff.permission.query('profile').then((permissionStatus: PermissionStatus) => {
      const state = permissionStatus.state;
      if (state === 'prompt') {
        liff.permission.requestAll();
      }
    });
  }


  // Promise<Profile>
  getProfile(): void {
    liff.permission.query('profile').then((status) => {
      if (status.state === 'granted') {
        liff.getProfile().then((data) => {
          console.log('getProfile: ', data);
          this.profile.displayName = data.displayName;
          this.profile.pictureUrl = data.pictureUrl;
          this.profile.statusMessage = data.statusMessage;
          this.profile.userId = data.userId;
        }).catch((error: Error | LiffError) => {
          this.logError('getProfile', error);
        }).finally(() => {
          console.log('getProfile complete');
        });
      } else if (status.state === 'prompt') {
        liff.permission.requestAll();
      }
    }).catch((error) => {
      this.logError('getProfilePermission', error);
    }).finally(() => {

    });
  }

  // Promise<Friendship>
  getFriendship(): void {
    liff.getFriendship().then(data => {
      if (data.friendFlag) {
        // something you want to do
      }
    });
    liff.getFriendship().then((data) => {
      console.log('getFriendship: ', data);
      this.friendship.friendFlag = data.friendFlag;
      if (data.friendFlag) {

      }
    }).catch((error: Error | LiffError) => {
      this.logError('getFriendship', error);
    }).finally(() => {
      console.error('getFriendship complete');
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

  initPlugins() {
    liff.initPlugins(['bluetooth']).then(() => {
      // liffCheckAvailablityAndDo(() => liffRequestDevice());
    }).catch(error => {
      console.log(error);
    });
  }

  sendMessages() {
    liff.sendMessages([
      {
        type: 'text',
        text: 'Hello, World!'
      }
    ]).then(() => {
      console.log('message sent');
    }).catch((error: Error | LiffError) => {
      this.logError('sendMessages', error);
    });
  }

  getAdvertisingId(): Promise<string> {
    return liff.getAdvertisingId().then().catch().finally();
  }

  isApiAvailable(): boolean {
    // Check if shareTargetPicker is available

    if (liff.isApiAvailable('shareTargetPicker')) {
      liff.shareTargetPicker([
        {
          type: "text",
          text: "Hello, World!"
        }
      ]).then(() => {
        console.log("ShareTargetPicker was launched");
      }).catch((error: Error | LiffError) => {
        this.logError('ShareTargetPicker', error);
      });
    }
    // Check if multiple liff transtion feature is available
    if (liff.isApiAvailable('multipleLiffTransition')) {
      window.location.href = `https://line.me/${this.liffId}`;
    }
    return null;
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

  logError(name: string, error: Error | LiffError) {
    console.error(`error ${name}`, error);
    if (error instanceof Error) {
      this.snackBar.open(`${error.name} ${name} : ${error.message}`, 'x');
    } else {
      this.snackBar.open(`${error.code} ${name} : ${error.message}`, 'x');
    }
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
