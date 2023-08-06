import Pusher from 'pusher-js';

const pusherClient = new Pusher("55281f94f1d8b452636d", {
  appId: "1647028",
  cluster: "eu",
  useTLS: true
});

export default pusherClient;
