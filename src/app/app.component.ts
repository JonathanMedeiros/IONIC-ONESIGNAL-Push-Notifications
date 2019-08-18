import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private alertController: AlertController,
    private oneSignal: OneSignal,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
    ) {
      this.initializeApp();
    }
    
    initializeApp() {
      this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        
        if(this.platform.is('cordova')){
          this.setupPush();
        }
        
      });
    }
    
    setupPush(){
      this.oneSignal.startInit('31af2a06-bf59-4200-a706-0fffc570893e', '970649635039'); // (ONESIGNAL APP ID, FireBAse Código do remetente)
      
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
      
      this.oneSignal.handleNotificationReceived().subscribe(data => {
        
        let title = data.payload.title;
        let message = data.payload.body;
        let additionalData = data.payload.additionalData;

        this.showAlert(title, message, additionalData.task);
        
      });
      
      this.oneSignal.handleNotificationOpened().subscribe(data => {

        let additionalData = data.notification.payload.additionalData;
        this.showAlert('Notification Opened', 'Mensagem de Teste', additionalData.task);

      });
      
      this.oneSignal.endInit();
      
    }
    
    
    async showAlert(title, message, task){
      
      const alert = await this.alertController.create({
        header: title,
        message: message,
        buttons: [
          {
            text:  `Action:  ${task}`,
            handler: () => {

            } 
          }
        ]
      });
      
      await alert.present();
    }
  }
  