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
        this.client = new Paho.MQTT.Client("broker.mqttdashboard.com", Number(8000), "/mqtt", "clientId");

        // set callback handlers
        this.client.onConnectionLost = this.onConnectionLost.bind(this);
        this.client.onMessageArrived = this.onMessageArrived;

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
