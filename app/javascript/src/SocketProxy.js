import io from 'socket.io-client'
// import { shared } from '../constants/shared'
// // NOTE: For system spec, it is difficult to make socket-proxy work with...
// import Env from './Env'

console.log(process.env.SOCKET_PROXY_URL)
const url = process.env.SOCKET_PROXY_URL

const singleton = {}
function socket () {
  if (!singleton.socket) {
    singleton.socket = io(url, {
      reconnectionDelay: 5000,
      transports: ['websocket']
    })
  }
  return singleton.socket
}

// Keep {{$name: {reconnect: func}}...} to re-subscribe on reconnect and off on unsubscribe.
const rooms = {}

function _subscribe (room, once, fn) {
  // if (Env.test) { return }

  const sub = () => {
    socket().emit('subscribe', { room }, (data) => {
      if (data.success) {
        if (once) {
          socket().once('update', (data) => {
            fn(data)
            unsubscribe(room)
          })
        } else {
          socket().on('update', fn)
        }
      } else {
        console.error(`subscribing room=${room} failed:`, data.message)
      }
    })
  }
  sub()
  socket().on('reconnect', sub)
  rooms[room] = { subscribe: sub }
}

function subscribe (room, fn) { _subscribe(room, false, fn) }
function subscribeOnce (room, fn) { _subscribe(room, true, fn) }

function unsubscribe (room) {
  // if (Env.test) { return }

  if (rooms[room]) {
    socket().emit('unsubscribe', { room })
    socket().off('reconnect', rooms[room].subscribe)
    delete rooms[room]
  }
}

/**
Example code:
  import SocketProxy from '../lib/SocketProxy'
  ...
  const room = 'image_xyz'
  # Subscribe
  SocketProxy.subscribe(room, (data) => {
    console.log(data)
  })
  ...
  # Unsubscribe
  SocketProxy.unsubscribe(room)

Then:
  curl http://SOCKET_PROXY_URL/publish \
    -d '{"room": "image_xyz", "args": [{"msg": "hello"}}]}' \
    -H "Content-Type: application/json" \
    -H "Authorization: token xxx"`
*/
export default {
  subscribe,
  subscribeOnce,
  unsubscribe
}
