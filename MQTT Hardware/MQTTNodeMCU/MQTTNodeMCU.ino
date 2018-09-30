/*
 Basic ESP8266 MQTT example

 This sketch demonstrates the capabilities of the pubsub library in combination
 with the ESP8266 board/library.

 It connects to an MQTT server then:
  - publishes "hello world" to the topic "outTopic" every two seconds
  - subscribes to the topic "inTopic", printing out any messages
    it receives. NB - it assumes the received payloads are strings not binary
  - If the first character of the topic "inTopic" is an 1, switch ON the ESP Led,
    else switch it off

 It will reconnect to the server if the connection is lost using a blocking
 reconnect function. See the 'mqtt_reconnect_nonblocking' example for how to
 achieve the same result without blocking the main loop.

 To install the ESP8266 board, (using Arduino 1.6.4+):
  - Add the following 3rd party board manager under "File -> Preferences -> Additional Boards Manager URLs":
       http://arduino.esp8266.com/stable/package_esp8266com_index.json
  - Open the "Tools -> Board -> Board Manager" and click install for the ESP8266"
  - Select your ESP8266 in "Tools -> Board"

*/

#include <ESP8266WiFi.h>
#include "PubSubClient.h"

// Update these with values suitable for your network.

const char* ssid = "Cuarto De Macias";
const char* password = "3028042214";
const char* mqtt_server = "broker.mqtt-dashboard.com";
const char* Topic = "AmberTopicRoomTopic92";
char* payloadArray;
String state;
String msgToSend;
int Device1 = 5;//D1
int Device2 = 4;//D2
int Device3 = 0;//D3
int Device4 = 2;//D4
int Device5 = 14;//D5
int Device6 = 12;//D6

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;

void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void updatePlaseVoid(){
  msgToSend = (String)"UpdateDevices" + (String)"," + Topic + (String)"," + (digitalRead(Device1)==HIGH) + (String)"," + (digitalRead(Device2)==HIGH) + (String)"," + (digitalRead(Device3)==HIGH) + (String)"," 
  + (digitalRead(Device4)==HIGH) + (String)"," + (digitalRead(Device5)==HIGH) + (String)"," + (digitalRead(Device6)==HIGH);
  char * tab2 = new char [msgToSend.length()+1];
strcpy (tab2, msgToSend.c_str());
  client.publish(Topic, tab2);
}

void callback(char* topic, byte* payload, unsigned int length) {
  payload[length] = '\0';
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  Serial.print((char*)payload);
  Serial.println();
  payloadArray = strtok ((char*)payload,",");
  if((String)"UpdatePlease"== payloadArray){ 
      updatePlaseVoid();
    }
   if((String)"TurnOffAll"== payloadArray){ 
      digitalWrite(Device1,LOW);
      digitalWrite(Device2,LOW);
      digitalWrite(Device3,LOW);
      digitalWrite(Device4,LOW);
      digitalWrite(Device5,LOW);
      digitalWrite(Device6,LOW);
      updatePlaseVoid();
    }
  if((String)"Device1" == payloadArray){ 
      state = strtok(NULL, ",");
      Serial.println(state);
      if ((String)"false" == state){Serial.println("false");digitalWrite(Device1,LOW);}
      if ((String)"true" == state){Serial.println("true");digitalWrite(Device1,HIGH);}
    }
  if((String)"Device2" == payloadArray){ 
      state = strtok(NULL, ",");
      if ((String)"false" == state){Serial.println("false");digitalWrite(Device2,LOW);}
      if ((String)"true" == state){Serial.println("true");digitalWrite(Device2,HIGH);}
    }
  if((String)"Device3" == payloadArray){ 
      state = strtok(NULL, ",");
      if ((String)"false" == state){Serial.println("false");digitalWrite(Device3,LOW);}
      if ((String)"true" == state){Serial.println("true");digitalWrite(Device3,HIGH);}
    }
  if((String)"Device4" == payloadArray){ 
      state = strtok(NULL, ",");
      if ((String)"false" == state){Serial.println("false");digitalWrite(Device4,LOW);}
      if ((String)"true" == state){Serial.println("true");digitalWrite(Device4,HIGH);}
    }
  if((String)"Device5" == payloadArray){ 
      state = strtok(NULL, ",");
      if ((String)"false" == state){Serial.println("false");digitalWrite(Device5,LOW);}
      if ((String)"true" == state){Serial.println("true");digitalWrite(Device5,HIGH);}
    }
  if((String)"Device6" == payloadArray){ 
      state = strtok(NULL, ",");
      if ((String)"false" == state){Serial.println("false");digitalWrite(Device6,LOW);}
      if ((String)"true" == state){Serial.println("true");digitalWrite(Device6,HIGH);}
    }
}
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      // ... and resubscribe
      client.subscribe(Topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  pinMode(Device1, OUTPUT);
  pinMode(Device2, OUTPUT);
  pinMode(Device3, OUTPUT);
  pinMode(Device4, OUTPUT);
  pinMode(Device5, OUTPUT);
  pinMode(Device6, OUTPUT);
  digitalWrite(Device1,LOW);
  digitalWrite(Device2,LOW);
  digitalWrite(Device3,LOW);
  digitalWrite(Device4,LOW);
  digitalWrite(Device5,LOW);
  digitalWrite(Device6,LOW);
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

}
