import {Injectable, OnInit} from "@angular/core";
import * as uuidv1 from "uuid/v1";
import {isUndefined} from "util";

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  user;

  constructor() {
  }

  ngOnInit() {
    this.user = uuidv1();
  }

  getUser() {
    if (isUndefined(this.user)) {
      this.user = uuidv1();
    }
    return this.user;
  }
}
