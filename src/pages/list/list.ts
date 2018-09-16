import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController, App } from 'ionic-angular';
import { MQTTService } from '../../services/MQTT.service';
import { AddDevicePage } from '../add-device/add-device';
import { SQLiteService } from '../../services/SQLite.service';
import { Storage } from '@ionic/storage';
import { SubjectService } from '../../services/Subjects.service';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  ListaDeDispositivos;
  constructor(
    public navCtrl: NavController,
    private MQTT:MQTTService,
    private alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public appCtrl: App,
    public SQLService: SQLiteService,
    private storage:Storage,
    private _SubjectService:SubjectService
  ) {
    this.storage.get('Dispositivos').then((val) => {
      const result = val;
      this._SubjectService.DevicesSubject.next(result);
    });
    this._SubjectService.DevicesSubject.subscribe(val => {
      this.ListaDeDispositivos = val;
    });
  }
  changeState(Topic,Dispositivo){
    Dispositivo.State = !Dispositivo.State;
    this.MQTT.SendMenssage(Topic + ',' + Dispositivo.ID + ',' + Dispositivo.State);
  }

  openModal() {
    this.appCtrl.getRootNav().push(AddDevicePage);
  }
}
