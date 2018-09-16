import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Img, App } from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from "@ionic/storage";
import { SubjectService } from "../../services/Subjects.service";

@IonicPage()
@Component({
  selector: "page-add-device",
  templateUrl: "add-device.html"
})
export class AddDevicePage {
  formDevice: FormGroup;
  ListD = [];
  Device1img = "assets/imgs/NOIMG.png";
  Device2img = "assets/imgs/NOIMG.png";
  Device3img = "assets/imgs/NOIMG.png";
  Device4img = "assets/imgs/NOIMG.png";
  Device5img = "assets/imgs/NOIMG.png";
  Device6img = "assets/imgs/NOIMG.png";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private storage: Storage,
    private _SubjectService:SubjectService,
    public appCtrl: App,
  ) {
    this.formDevice = this.fb.group({
      GroupName: ["", Validators.required],
      TopicID: ["", Validators.required],
      Device1: ["", Validators.required],
      Device1IMG: [""],
      Device2: ["", Validators.required],
      Device2IMG: [""],
      Device3: ["", Validators.required],
      Device3IMG: [""],
      Device4: ["", Validators.required],
      Device4IMG: [""],
      Device5: ["", Validators.required],
      Device5IMG: [""],
      Device6: ["", Validators.required],
      Device6IMG: [""]
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AddDevicePage");
  }
  get GroupNameIsInvalid() {
    return (
      this.formDevice.get("GroupName").invalid &&
      this.formDevice.get("GroupName").touched
    );
  }

  get TopicIDIsInvalid() {
    return (
      this.formDevice.get("TopicID").invalid &&
      this.formDevice.get("TopicID").touched
    );
  }

  get Device1IsInvalid() {
    return (
      this.formDevice.get("Device1").invalid &&
      this.formDevice.get("Device1").touched
    );
  }

  get Device2IsInvalid() {
    return (
      this.formDevice.get("Device2").invalid &&
      this.formDevice.get("Device2").touched
    );
  }
  get Device3IsInvalid() {
    return (
      this.formDevice.get("Device3").invalid &&
      this.formDevice.get("Device3").touched
    );
  }
  get Device4IsInvalid() {
    return (
      this.formDevice.get("Device4").invalid &&
      this.formDevice.get("Device4").touched
    );
  }
  get Device5IsInvalid() {
    return (
      this.formDevice.get("Device5").invalid &&
      this.formDevice.get("Device5").touched
    );
  }
  get Device6IsInvalid() {
    return (
      this.formDevice.get("Device6").invalid &&
      this.formDevice.get("Device6").touched
    );
  }

  get Complete() {
    return this.formDevice.valid;
  }

  takePhoto(event, SOURCE) {
    let files = event.target.files;
    let file = files[0];

    var reader = new FileReader();
    reader.addEventListener(
      "load",
      (event: any) => {
        this[SOURCE] = event.target.result;
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }
  saveDevice() {
    const FormaSub = {
      GroupName: this.formDevice.get("GroupName").value,
      TopicID: this.formDevice.get("TopicID").value,
      Dispositivos: [
        {
          Name: this.formDevice.get("Device1").value,
          Img: this.Device1img ? this.Device1img : '',
          ID: "Device1",
          State:false
        },
        {
          Name: this.formDevice.get("Device2").value,
          Img: this.Device2img ? this.Device2img : '',
          ID: "Device2",
          State:false
        },
        {
          Name: this.formDevice.get("Device3").value,
          Img: this.Device3img ? this.Device3img : '',
          ID: "Device3",
          State:false
        },
        {
          Name: this.formDevice.get("Device4").value,
          Img: this.Device4img ? this.Device4img : '' ,
          ID: "Device4",
          State:false
        },
        {
          Name: this.formDevice.get("Device5").value,
          Img: this.Device5img ? this.Device5img : '',
          ID: "Device5",
          State:false
        },
        {
          Name: this.formDevice.get("Device6").value,
          Img: this.Device6img ? this.Device6img : '',
          ID: "Device6",
          State:false
        }
      ]
    };
    this.ListD.push(FormaSub);
    this.storage.set("Dispositivos", this.ListD);
    this._SubjectService.DevicesSubject.next(this.ListD);
    this.appCtrl.getRootNav().pop();
  }
}
