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
    this.timeTimer = setInterval(this.updateTime, 10000)
  }

  componentWillUnmount() {
    clearInterval(this.timeTimer)
  }

  render() {
    return this.state.fromNowString
  }

  timeFromNow = (datetime) => {
    return <span>{moment(datetime).fromNow()}</span>
  }

  updateTime = () => {
    this.setState({
      fromNowString: this.timeFromNow(this.props.datetime)
    })
  }
}

export default TimeFromNow
