import {Component, OnInit} from "@angular/core";
import {UserService} from "../user.service";
import * as io from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-watch-room',
  templateUrl: './watch-room.component.html',
  styleUrls: ['./watch-room.component.css']
})
export class WatchRoomComponent implements OnInit {

  constructor(private userService: UserService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    const peer = this.userService.getUser();

    const room = this.route.snapshot.params.room;

    const socket = io('http://localhost:8080', {path: '/room', query: {peer, room}});

    const mediaRoom = new mediasoupClient.Room();

    let recvTransport;

    mediaRoom.join(peer)
      .then((peers) => {
        recvTransport = mediaRoom.createTransport('recv');

        peers.forEach(peer => handlePeer(peer));
      });

    mediaRoom.on('request', (request, callback, errback) => {
      socket.emit('mediasoup-request', request, (err, response) => {
        if (!err) {
          callback(response);
        } else {
          errback(err);
        }
      });
    });

    mediaRoom.on('notify', (notification) => {
      socket.emit('mediasoup-notification', notification);
    });

    mediaRoom.on('newpeer', (peer) => {
      handlePeer(peer);
    });

    socket.on('mediasoup-notification', (notification) => {
      mediaRoom.receiveNotification(notification);
    });

    function handlePeer(peer) {
      peer.consumers.forEach(consumer => handleConsumer(consumer));

      peer.on('newconsumer', (consumer) => {
        handleConsumer(consumer);
      });
    }

    function handleConsumer(consumer) {
      consumer.receive(recvTransport)
        .then((track) => {
          const stream = new MediaStream();
          stream.addTrack(track);

          if (consumer.kind === 'video') {
            const video = <HTMLVideoElement>document.getElementById('watch-video-container');
            video.srcObject = stream;
            video.play();
          }
          if (consumer.kind === 'audio') {
            const audio = <HTMLAudioElement>document.getElementById('watch-audio-container');
            audio.srcObject = stream;
            audio.play();
          }
        });
    }
  }
}
