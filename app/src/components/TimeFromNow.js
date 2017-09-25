import React, { Component } from 'react'
import moment from 'moment'

class TimeFromNow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fromNowString: this.timeFromNow(props.datetime)
    }
  }

  componentDidMount() {
    this.updateRaf = window.requestAnimationFrame(this.updateTime.bind(this))
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.updateRaf)
  }

  render() {
    return <span>{this.state.fromNowString}</span>
  }

  timeFromNow = (datetime) => {
    return moment(datetime).fromNow()
  }

  updateTime = () => {
    const newTimeFromNow = this.timeFromNow(this.props.datetime)

    if (newTimeFromNow !== this.state.fromNowString) {
      this.setState({
        fromNowString: newTimeFromNow
      })
    }

    window.requestAnimationFrame(this.updateTime.bind(this))
  }
}

export default TimeFromNow
