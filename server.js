const config = require('./config');
const http = require('http');
const io = require('socket.io');
const mediasoup = require('mediasoup');

const httpServer = http.createServer();
httpServer.listen(config.server.port, () => console.log(`Server is listening on port ${config.server.port}`));

const appIO = io(httpServer, {
    path: '/app',
    serveClient: false,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

const roomIO = io(httpServer, {
    path: '/room',
    serveClient: false,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

const mediaServer = mediasoup.Server({
    numWorkers: null,
    logLevel: config.mediasoup.logLevel,
    logTags: config.mediasoup.logTags,
    rtcIPv4: config.mediasoup.rtcIPv4,
    rtcIPv6: config.mediasoup.rtcIPv6,
    rtcAnnouncedIPv4: config.mediasoup.rtcAnnouncedIPv4,
    rtcAnnouncedIPv6: config.mediasoup.rtcAnnouncedIPv6,
    rtcMinPort: config.mediasoup.rtcMinPort,
    rtcMaxPort: config.mediasoup.rtcMaxPort
});

const mediaRooms = new Map();

roomIO.on('connection', (socket) => {

    let mediaPeer = null;
    const {peer, room} = socket.handshake.query;

    let mediaRoom = mediaRooms.get(room);
    if (mediaRoom == null) {
        mediaRoom = mediaServer.Room(config.mediasoup.mediaCodecs);
        mediaRoom.on('close', () => {
            rooms.delete(room);
        });
        mediaRooms.set(room, mediaRoom);
    }

    socket.on('mediasoup-request', (request, cb) => {
        switch (request.method) {
            case 'queryRoom':
                mediaRoom.receiveRequest(request)
                    .then((response) => cb(null, response))
                    .catch((error) => cb(error.toString()));
                break;

            case 'join':
                mediaRoom.receiveRequest(request)
                    .then((response) => {
                        mediaPeer = mediaRoom.getPeerByName(peer);
                        mediaPeer.on('notify', (notification) => {
                            socket.emit('mediasoup-notification', notification);
                        });
                        cb(null, response);
                    })
                    .catch((error) => cb(error.toString()));
                break;

            default:
                if (mediaPeer) {
                    mediaPeer.receiveRequest(request)
                        .then((response) => cb(null, response))
                        .catch((error) => cb(error.toString()));
                }
        }

    });

    socket.on('mediasoup-notification', (notification) => {
        if (!mediaPeer) {
            return;
        }
        mediaPeer.receiveNotification(notification);
    });

    socket.on('disconnect', () => {
        if (mediaPeer) {
            mediaPeer.close();
        }
    });
});

appIO.on('connection', (socket) => {
    socket.on('app-request', (request, cb) => {
        switch (request.method) {
            case 'listRooms':
                cb(null, Array.from(mediaRooms.keys()));
                // cb(null, ['a', 'b']);
                break;
        }
    });
});
