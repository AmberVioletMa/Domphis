import { Injectable, OnInit } from "@angular/core";
import {Paho} from 'ng2-mqtt/mqttws31';
import { SubjectService } from "./Subjects.service";
import { AlertController } from 'ionic-angular';

@Injectable()
export class MQTTService  {
  private client: Paho.MQTT.Client;

  private subscribeOptions = {
    qos: 2, // QoS
    onSuccess: this.onSuccessCallback,
    onFailure: this.onFailureCallback,
    timeout: 10
};

  public constructor( private _SubjectService:SubjectService, private alertCtrl: AlertController ) {
    this.onInitVoid();
  }

  private onInitVoid(){
        // Create a client instance
        this.client = new Paho.MQTT.Client("broker.mqttdashboard.com", Number(8000), "/mqtt", Math.random().toString(36).slice(2));

        // set callback handlers
        this.client.onConnectionLost = this.onConnectionLost.bind(this);
        this.client.onMessageArrived = this.onMessageArrived.bind(this);

        // connect the client
        this.client.connect({onSuccess:this.onConnect.bind(this)});

        this._SubjectService.TopicSubject.subscribe(val => {
          this._SubjectService.topics =[];
          if(val){
          for( let topic of val){
            this._SubjectService.topics.push(topic.TopicID);
            }
          }
        });
  }

  private onConnect() {
    console.log("Connected");
    // Once a connection has been made, make a subscription and send a message.
    for(let topic of this._SubjectService.topics){
      this.client.subscribe(topic,this.subscribeOptions);
      this.SendMenssage(topic,"UpdatePlease");
    }
  }

  // called when the client loses its connection
  private onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
    }
  }

  // called when a message arrives
  private onMessageArrived(message) {
    console.log("MessageArrived:"+message.payloadString);
    let Tokens = message.payloadString.split(",");
    if(Tokens[0] === 'UpdateDevices'){
      // UpdateDevices,AmberTopicRoomTopic92,0,0,1,0,1,0
      this._SubjectService.Devices = this._SubjectService.Devices.map( Device => {
        if(Device.TopicID === Tokens[1]){
          Device.Dispositivos[0].State = (Tokens[2] === '1');
          Device.Dispositivos[1].State = (Tokens[3] === '1');
          Device.Dispositivos[2].State = (Tokens[4] === '1');
          Device.Dispositivos[3].State = (Tokens[5] === '1');
          Device.Dispositivos[4].State = (Tokens[6] === '1');
          Device.Dispositivos[5].State = (Tokens[7] === '1');
        }
        return Device;
      });
    }
  }

  private onSuccessCallback() { console.log('Success on the Subscribe');}
  private onFailureCallback() { console.log('Failure on the Subscribe');this.ConnectionLoseAlert();}

  public SendMenssage(Topic,Mensaje){
    // Publish a Message
    let message = new Paho.MQTT.Message(Mensaje);
    message.destinationName = Topic;
    message.qos = 2;

    try{this.client.send(message);}
    catch {this.ConnectionLoseAlert();}
  }

  public reConnect(){
    this.client.disconnect();
    this.onInitVoid();
  }

  public reConnectWhenClose(){
    this.onInitVoid();
  }

  public ConnectionLoseAlert() {
    let alert = this.alertCtrl.create({
      title: 'Lose Connection',
      message: 'The server lose connection, please try to re-connet',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 're-connect',
          handler: () => {
            this.onInitVoid();
          }
        }
      ]
    });
    alert.present();
  }
}
