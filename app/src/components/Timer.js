import React, { Component } from 'react'
import moment from 'moment'

class Timer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timerString: this.getTimerString(props.datetime)
    }
  }

  componentDidMount() {
    this.updateRaf = window.requestAnimationFrame(this.updateTime.bind(this))
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.updateRaf)
  }

  render() {
    return <span>{this.state.timerString}</span>
  }

  getTimerString = (datetime) => {
    const diff = moment().diff(moment(datetime))
    return moment.utc(diff).format("mm:ss")
  }

  updateTime = () => {
    const newTimerString = this.getTimerString(this.props.datetime)

    if (newTimerString !== this.state.timerString) {
      this.setState({
        timerString: newTimerString
      })
    }

    window.requestAnimationFrame(this.updateTime.bind(this))
  }
}

export default Timer
