import { Injectable, OnInit } from "@angular/core";
import { Subject } from "rxjs/Subject";


@Injectable()
export class SubjectService {
  public DevicesSubject = new Subject();

}
