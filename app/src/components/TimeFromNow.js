import React, { Component } from 'react'
import moment from 'moment'
import raf from 'raf'

class TimeFromNow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fromNowString: this.timeFromNow(props.datetime)
    }
  }

  componentDidMount() {
    this.lastUpdateTime = Date.now()
    this.updateTime()
  }

  componentWillUnmount() {
    raf.cancel(this.rafHandle)
  }

  render() {
    return <span>{this.state.fromNowString}</span>
  }

  timeFromNow = (datetime) => {
    return moment(datetime).fromNow()
  }

  updateTime = () => {
    this.rafHandle = raf(this.updateTime)

    // Throttle to 4fps (250ms difference)
    const elapsedTime = Date.now() - this.lastUpdateTime
    if (elapsedTime < 250) return

    const newTimeFromNow = this.timeFromNow(this.props.datetime)

    if (newTimeFromNow !== this.state.fromNowString) {
      this.setState({
        fromNowString: newTimeFromNow
      })
    }

    this.lastUpdateTime = Date.now()
  }
}

export default TimeFromNow
