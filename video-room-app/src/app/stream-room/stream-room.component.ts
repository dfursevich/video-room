import {Component, OnInit} from "@angular/core";
import * as io from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import {UserService} from "../user.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-stream-room',
  templateUrl: './stream-room.component.html',
  styleUrls: ['./stream-room.component.css']
})
export class StreamRoomComponent implements OnInit {

  mediaRoom = null;

  constructor(private userService: UserService, private route: ActivatedRoute) {
  }

  ngOnInit() {}

  startStream() {
    const peer = this.userService.getUser();

    const room = this.route.snapshot.params.room;

    const socket = io('http://localhost:8080', {path: '/room', query: {peer, room}});
    socket.on('mediasoup-notification', (notification) => {
      this.mediaRoom.receiveNotification(notification);
    });

    this.mediaRoom = new mediasoupClient.Room();
    this.mediaRoom.on('request', (request, callback, errback) => {
      socket.emit('mediasoup-request', request, (err, response) => {
        if (!err) {
          callback(response);
        } else {
          errback(err);
        }
      });
    });

    this.mediaRoom.on('notify', (notification) => {
      socket.emit('mediasoup-notification', notification);
    });

    let sendTransport;

    this.mediaRoom.join(peer)
      .then((peers) => {
        sendTransport = this.mediaRoom.createTransport('send');
      })
      .then(() => {
        return navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
      })
      .then((stream) => {
        const audioTrack = stream.getAudioTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];

        const localStream = new MediaStream([videoTrack, audioTrack]);
        const video = <HTMLVideoElement>document.getElementById('stream-container');
        video.srcObject = localStream;
        video.play();

        const audioProducer = this.mediaRoom.createProducer(audioTrack);
        const videoProducer = this.mediaRoom.createProducer(videoTrack);
        audioProducer.on('close', () => audioTrack.stop());
        videoProducer.on('close', () => videoTrack.stop());

        audioProducer.send(sendTransport);
        videoProducer.send(sendTransport);
      });
  }

  stopStream() {
    this.mediaRoom.leave();
  }
}
