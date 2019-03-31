import { Component, OnInit } from '@angular/core';
import * as io from "socket.io-client";
import * as uuidv1 from "uuid/v1";

@Component({
  selector: 'app-list-rooms',
  templateUrl: './list-rooms.component.html',
  styleUrls: ['./list-rooms.component.css']
})
export class ListRoomsComponent implements OnInit {
  rooms = [];

  ngOnInit() {
    const appSocket = io('http://localhost:8080', {path: '/app'});

    appSocket.on('connect', () => {
      appSocket.emit('app-request', {
        method: "listRooms"
      }, (err, response) => {
        if (!err) {
          this.rooms = response;
        }
      });
    });
  }

  get newRoom() {
    return uuidv1();
  }
}
