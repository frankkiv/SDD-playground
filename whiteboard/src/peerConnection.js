import Peer from 'peerjs'

const PREFIX = 'wb-'

function randomCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export function createPeerConnection() {
  let peer = null
  let conn = null
  let handlers = { onData: null, onConnect: null, onDisconnect: null, onError: null }

  function setupConn(c) {
    conn = c
    conn.on('data', data => handlers.onData?.(data))
    conn.on('close', () => handlers.onDisconnect?.())
    conn.on('error', err => handlers.onError?.(err))
  }

  function createRoom() {
    return new Promise((resolve, reject) => {
      const code = randomCode()
      peer = new Peer(PREFIX + code)

      peer.on('open', () => {
        resolve(code)
      })

      peer.on('connection', c => {
        setupConn(c)
        c.on('open', () => handlers.onConnect?.())
      })

      peer.on('error', err => {
        reject(err)
      })
    })
  }

  function joinRoom(code) {
    return new Promise((resolve, reject) => {
      peer = new Peer()

      peer.on('open', () => {
        const c = peer.connect(PREFIX + code, { reliable: true })

        c.on('open', () => {
          setupConn(c)
          handlers.onConnect?.()
          resolve()
        })

        c.on('error', err => {
          reject(err)
        })
      })

      peer.on('error', err => {
        reject(err)
      })
    })
  }

  function sendData(data) {
    if (conn && conn.open) {
      conn.send(data)
    }
  }

  function destroy() {
    conn?.close()
    peer?.destroy()
    conn = null
    peer = null
  }

  function on(event, callback) {
    handlers[event] = callback
  }

  return { createRoom, joinRoom, sendData, destroy, on }
}
