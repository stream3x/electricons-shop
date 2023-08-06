// server/pusher.js (for the backend)
import Pusher from 'pusher';

const pusherServer = new Pusher({
  appId: "1647028",
  key: "55281f94f1d8b452636d",
  secret: "f43417c15d34bc0bd062",
  cluster: "eu",
  useTLS: true,
});

export default pusherServer;