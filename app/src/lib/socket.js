import { Socket as WebSocket } from 'phoenix'
import { normalize } from 'normalizr'
import * as schema from 'lib/schema'
import { addEntities, updateProject, fetchBuild } from 'lib/store'

let instance = null

class Socket {
  constructor(dispatch) {
    this.dispatch = dispatch
    this.ws = new WebSocket("ws://localhost:4000/socket", {})
    this.channels = {}
    this.ws.connect()

    instance = this
  }

  // This is a singleton
  static instance(dispatch) {
    if (instance == null) return new Socket(dispatch)
    return instance
  }

  join(room, attrs = {}) {
    const channel = this.ws.channel(room, {})
    this.channels[room] = channel
    channel.join()
      .receive("ok", () => console.log(`[WS] Joined Channel: ${room}`))
      .receive("error", () => console.log(`[WS] Failed to join Channel: ${room}`))
      .receive("timeout", () => console.log(`[WS] Still waiting to join Channel: ${room}`))

    channel.on("event", payload => {
      const { event, data: response } = payload

      const [ , eventType, entityName ] = /entity:(.*):(.*)$/.exec(event)
      const matchedSchema = this._getSchemaFromString(entityName)
      if (matchedSchema == null) return

      const data = normalize(response, matchedSchema)

      this.dispatch(addEntities(data.entities))

      if (eventType === "create" && entityName === "build") {
        this.dispatch(updateProject(attrs.projectId))
      }

      if (eventType === "change" && entityName === "build" && response.status === "active") {
        this.dispatch(fetchBuild(data.result))
      }
    })
  }

  leave(room) {
    this.channels[room].leave()
      .receive("ok", () => {
        console.log(`[WS] Leaving Channel: ${room}`)
        delete this.channels[room]
      })
  }

  joinProject(id) {
    this.join(`project:${id}`, { projectId: id })
  }

  leaveProject(id) {
    this.leave(`project:${id}`)
  }

  joinGeneral() {
    this.join(`topic:general`)
  }

  leaveGeneral() {
    this.leave(`topic:general`)
  }

  _getSchemaFromString(str) {
    switch (str) {
      case "build": return schema.build
      case "stage": return schema.stage
      case "step": return schema.step
      default: return null
    }
  }


}

export default Socket
