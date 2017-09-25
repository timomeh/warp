import React, { Component } from 'react'
import moment from 'moment'
import raf from 'raf'

class Timer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timerString: this.getTimerString(props.datetime)
    }
  }

  componentDidMount() {
    this.updateTime()
  }

  componentWillUnmount() {
    raf.cancel(this.rafHandle)
  }

  render() {
    return <span>{this.state.timerString}</span>
  }

  getTimerString = (datetime) => {
    const diff = moment().diff(moment(datetime))
    return moment.utc(diff).format("mm:ss")
  }

  updateTime = () => {
    this.rafHandle = raf(this.updateTime)

    // Throttle to 4fps (250ms difference)
    const elapsedTime = Date.now() - this.lastUpdateTime
    if (elapsedTime < 250) return

    const newTimerString = this.getTimerString(this.props.datetime)

    if (newTimerString !== this.state.timerString) {
      this.setState({
        timerString: newTimerString
      })
    }

    this.lastUpdateTime = Date.now()
  }
}

export default Timer
