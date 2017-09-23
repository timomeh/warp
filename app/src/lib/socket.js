import { Socket as WebSocket } from 'phoenix'
import { normalize } from 'normalizr'
import * as schema from 'lib/schema'
import { addEntities, fetchProject } from 'lib/store'

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
      .receive("timeout", () => console.log(`[WS] Still waiting to join Channel: ${room}`))

    channel.on("event", payload => {
      console.log(payload)
      const { event, data: response } = payload

      const [ , eventType, entityName ] = /entity:(.*):(.*)$/.exec(event)
      const matchedSchema = this._getSchemaFromString(entityName)
      if (matchedSchema == null) return

      const data = normalize(response, matchedSchema)

      this.dispatch(addEntities(data.entities))

      if (eventType === "create" && entityName === "build") {
        this.dispatch(fetchProject(data.entities.builds[data.result].project_id))
      }
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
