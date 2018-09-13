import { Injectable, OnInit } from "@angular/core";
import {Paho} from 'ng2-mqtt/mqttws31';

@Injectable()
export class MQTTService {
  private client: Paho.MQTT.Client;

  private subscribeOptions = {
    qos: 2, // QoS
    onSuccess: this.onSuccessCallback,
    onFailure: this.onFailureCallback,
    timeout: 10
};

  public constructor() {
    // Create a client instance
    this.client = new Paho.MQTT.Client("broker.mqttdashboard.com", Number(8000), "/mqtt", "clientId");

    // set callback handlers
    this.client.onConnectionLost = this.onConnectionLost;
    this.client.onMessageArrived = this.onMessageArrived;

    // connect the client
    this.client.connect({onSuccess:this.onConnect.bind(this)});
  }

  private onConnect() {
    console.log("Connected");
    // Once a connection has been made, make a subscription and send a message.
    this.client.subscribe('testtopic/2',this.subscribeOptions);
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
  private onFailureCallback() { console.log('Failure on the Subscribe');}

  public SendMenssage(Mensaje){
    // Publish a Message
    let message = new Paho.MQTT.Message(Mensaje);
    message.destinationName = 'testtopic/2';
    message.qos = 2;

    this.client.send(message);
  }

}
