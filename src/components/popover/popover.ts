import { Component } from "@angular/core";
import {
  AlertController,
  NavParams,
  NavController,
  ViewController,
  App
} from "ionic-angular";
import { MQTTService } from "../../services/MQTT.service";
import { SubjectService } from "../../services/Subjects.service";
import { Storage } from "@ionic/storage";
import { AddDevicePage } from "../../pages/add-device/add-device";

@Component({
  selector: "popover",
  templateUrl: "popover.html"
})
export class PopoverComponent {
  text: string;

  constructor(
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private _SubjectService: SubjectService,
    public viewCtrl: ViewController,
    public appCtrl: App,
    private MQTT: MQTTService
  ) {}

  Delete() {
    this.DeleteAlert();
  }

  Edit() {
    let Device = this.navParams.get("Device");
    let index = this.navParams.get("index");
    this.appCtrl
      .getRootNav()
      .push(AddDevicePage, { Device: Device, index: index });
    try {
      this.viewCtrl.dismiss();
    } catch {}
  }

  HideDevices() {
    this.HideAlert();
  }

  TurnOff() {
    let Device = this.navParams.get("Device");
    this.MQTT.SendMenssage(Device.TopicID, "TurnOffAll");
    try {
      this.viewCtrl.dismiss();
    } catch {}
  }

  DeleteAlert() {
    let alert = this.alertCtrl.create({
      title: "Delete Device",
      message: "Are you sure you want to delete the device?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            try {
              this.viewCtrl.dismiss();
            } catch {}
          }
        },
        {
          text: "Delete",
          handler: () => {
            let ThisDevice = this.navParams.get("Device");
            let ListD = this._SubjectService.Devices;
            for (let Device in ListD) {
              if (ListD[Device].GroupName === ThisDevice.GroupName) {
                this._SubjectService.Devices.splice(Device, 1);
              }
            }
            console.log(this._SubjectService.Devices);
            this.storage.set("Dispositivos", this._SubjectService.Devices);
            try {
              this.viewCtrl.dismiss();
            } catch {}
          }
        }
      ]
    });
    alert.present();
  }
  HideAlert() {
    let Device = this.navParams.get("Device");
    let alert = this.alertCtrl.create({
      title: "Specify the reason",
      inputs: [
        {
          type: "checkbox",
          label: Device.Dispositivos[0].Name,
          checked: Device.Dispositivos[0].Hide,
          value: "Device1"
        },
        {
          type: "checkbox",
          label: Device.Dispositivos[1].Name,
          checked: Device.Dispositivos[1].Hide,
          value: "Device2"
        },
        {
          type: "checkbox",
          label: Device.Dispositivos[2].Name,
          checked: Device.Dispositivos[2].Hide,
          value: "Device3"
        },
        {
          type: "checkbox",
          label: Device.Dispositivos[3].Name,
          checked: Device.Dispositivos[3].Hide,
          value: "Device4"
        },
        {
          type: "checkbox",
          label: Device.Dispositivos[4].Name,
          checked: Device.Dispositivos[4].Hide,
          value: "Device5"
        },
        {
          type: "checkbox",
          label: Device.Dispositivos[5].Name,
          checked: Device.Dispositivos[5].Hide,
          value: "Device6"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            try {
              this.viewCtrl.dismiss();
            } catch {}
          }
        },
        {
          text: "OK",
          handler: data => {
            this._SubjectService.Devices = this._SubjectService.Devices.map(
              Devicess => {
                if (Device.GroupName === Devicess.GroupName) {
                  Devicess.Dispositivos = Devicess.Dispositivos.map(
                    Dispositivo => {
                      if (data.length !== 0) {
                        for (let ID of data) {
                          if (Dispositivo.ID === ID) {
                            Dispositivo.Hide = true;
                            break;
                          } else {
                            Dispositivo.Hide = false;
                          }
                        }
                      } else {
                        Dispositivo.Hide = false;
                      }
                        return Dispositivo;
                    }
                  );
                }
                return Devicess;
              }
            );
            this.storage.set("Dispositivos", this._SubjectService.Devices);
            try {
              this.viewCtrl.dismiss();
            } catch {}
          }
        }
      ]
    });
    alert.present();
  }
}
