import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import liff from '@line/liff';
// import * as semver from 'semver';
import { AIdInterface, Context, Friendship, JWTPayload, LiffError, OS, PluginName, Profile, ProfilePlusInterface, SendMessagesParams, ShareTargetPickerOptions, ShareTargetPickerResult } from './liff';

@Injectable({
  providedIn: 'root'
})
export class LiffService {

  constructor(private snackBar: MatSnackBar) { }

  init(liffId: string): Promise<void> {
    const promiseOf = 'init';
    return liff.init({
      liffId: liffId, // Use own liffId
    }).then((data) => {
      this.logThen(promiseOf, data);
    }).catch((error: Error | LiffError) => {
      this.logCatch(promiseOf, error);
    }).finally(() => {
      this.logFinally(promiseOf);
    });
  }

  initPlugins(plugins: PluginName[]): Promise<void> {
    const promiseOf = 'initPlugins';
    return liff.initPlugins(plugins).then((data) => {
      this.logThen(promiseOf, data);
    }).catch((error: Error | LiffError) => {
      this.logCatch(promiseOf, error);
    }).finally(() => {
      this.logFinally(promiseOf);
    });
  }

  login(): void {
    liff.login();
  }

  logout(): void {
    liff.logout();
  }

  sendMessages(messages: SendMessagesParams): Promise<void> {
    const promiseOf = 'sendMessages';
    return liff.sendMessages(messages).then((data) => {
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

  isApiAvailable(apiName: string) {
    return liff.isApiAvailable(apiName);
  }

  shareTargetPicker(messages: SendMessagesParams, options?: ShareTargetPickerOptions): Promise<ShareTargetPickerResult | void> {
    return liff.shareTargetPicker(messages, options);
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

  isMultipleLiffTransitionApiAvailable(liffId: string): any {
    const promiseOf = 'multipleLiffTransition';
    if (liff.isApiAvailable('multipleLiffTransition')) {
      window.location.href = `https://line.me/${liffId}`;
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

  getId(): string {
    return liff.id;
  }

  // OS
  getOS(): OS {
    return liff.getOS()
  }

  getLanguage(): string {
    return liff.getLanguage();
  }

  // AIdInterface | undefined
  getAId(): AIdInterface | undefined {
    return liff.getAId();
  }

  getAccessToken(): string {
    return liff.getAccessToken();
  }

  // Context | null
  getContext(): Context | null {
    return liff.getContext();
  }

  // JWTPayload | null
  getDecodedIDToken(): JWTPayload | null {
    return liff.getDecodedIDToken();
  }

  getIDToken(): string {
    return liff.getIDToken();
  }

  getIsVideoAutoPlay(): boolean {
    return liff.getIsVideoAutoPlay();
  }

  getLineVersion(): string {
    return liff.getLineVersion();
  }

  getProfilePlus(): ProfilePlusInterface | undefined {
    return liff.getProfilePlus();
  }

  getVersion(): string {
    return liff.getVersion();
  }

  getIsInClient(): boolean {
    return liff.isInClient();
  }

  getIsLoggedIn(): boolean {
    return liff.isLoggedIn();
  }

  getIsSubWindow(): boolean {
    return liff.isSubWindow();
  }

  // Promise<Profile>
  getProfile(): Promise<Profile> {
    this.logCallFunction('getProfile');
    const promisOf = 'getProfile';
    return liff.getProfile();
    // return liff.getProfile().then((data) => {
    //   this.logThen(promisOf, data);
    //   localStorage.setItem('profile', JSON.stringify(data));
    // }).catch((error: Error | LiffError) => {
    //   this.logCatch(promisOf, error);
    // }).finally(() => {
    //   this.logFinally(promisOf);
    // });
  }

  // Promise<Friendship>
  getFriendship(): Promise<Friendship> {
    this.logCallFunction('getFriendship');
    const promiseOf = 'getFriendship';
    return liff.getFriendship();
    // return liff.getFriendship().then((data) => {
    //   this.logThen(promiseOf, data);
    //   return data;
    // }).catch((error: Error | LiffError) => {
    //   this.logCatch(promiseOf, error);
    // }).finally(() => {
    //   this.logFinally(promiseOf);
    // });
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
}
