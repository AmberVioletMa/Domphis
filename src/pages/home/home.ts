import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MQTTService } from '../../services/MQTT.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public MQTT:MQTTService) {

  }

}
