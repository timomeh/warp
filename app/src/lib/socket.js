import { Socket as WebSocket } from 'phoenix'
import { normalize } from 'normalizr'
import * as schema from 'lib/schema'
import { addEntities } from 'lib/store'

class Socket {
  static instance

  constructor(dispatch) {
    // This is a singleton
    if (this.instance) return this.instance

    this.dispatch = dispatch
    this.ws = new WebSocket("ws://localhost:4000/socket", {})
    this.instance = this
  }

  connect() {
    this.ws.connect()
  }

  join(room) {
    let channel = this.ws.channel(room, {})
    channel.join()
      .receive("ok", () => console.log(`[WS] Joined Channel: ${room}`))
      .receive("error", () => console.log(`[WS] Failed to join Channel: ${room}`))
      .receive("timeout", () => console.log(`[WS] Still wairing to join Channel: ${room}`))

    channel.on("event", payload => {
      const { event, data: response } = payload

      const match = /entity:change:(.*)$/.exec(event)
      const matchedSchema = this._getSchemaFromString(match[1])
      if (matchedSchema == null) return

      const data = normalize(response, matchedSchema)
      console.log(data.entities)
      this.dispatch(addEntities(data.entities))
    })
  }

  _getSchemaFromString(str) {
    switch (str) {
      case "build": return schema.build
      default: return null
    }
  }


}

export default Socket
