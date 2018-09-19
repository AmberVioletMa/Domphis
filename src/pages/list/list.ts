import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController, App } from 'ionic-angular';
import { MQTTService } from '../../services/MQTT.service';
import { AddDevicePage } from '../add-device/add-device';
import { SQLiteService } from '../../services/SQLite.service';
import { Storage } from '@ionic/storage';
import { SubjectService } from '../../services/Subjects.service';
import { PopoverController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  ListaDeDispositivos:any;
  constructor(
    public navCtrl: NavController,
    private MQTT:MQTTService,
    private alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public appCtrl: App,
    public SQLService: SQLiteService,
    private storage:Storage,
    private _SubjectService:SubjectService,
    public popoverCtrl: PopoverController
  ) {
    this.storage.get('Dispositivos').then((val) => {
      const result = val;
      this._SubjectService.DevicesSubject.next(result);
      this._SubjectService.TopicSubject.next(result);
    });
    this._SubjectService.DevicesSubject.subscribe(val => {
      this.ListaDeDispositivos = val;
      this._SubjectService.Devices = val;
      this.MQTT.reConnect();
    });
  }
  changeState(Topic,Dispositivo){
    Dispositivo.State = !Dispositivo.State;
    this.MQTT.SendMenssage(Topic, Dispositivo.ID + ',' + Dispositivo.State);
  }

  openModal() {
    this.appCtrl.getRootNav().push(AddDevicePage);
  }

  presentPopover(myEvent,data) {
    let popover = this.popoverCtrl.create(PopoverComponent, data);
    popover.present({
      ev: myEvent
    });
  }

}
