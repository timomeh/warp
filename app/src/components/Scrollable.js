import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SimpleBar from 'simplebar'

import './Scrollable.css'

class Scrollable extends Component {
  static defaultProps = {
    autoHide: true,
    scrollbarMinSize: 10,
    classNameContent: 'u-Scrollable-content',
    classNameScrollContent: 'u-Scrollable-scrollContent',
    classNameScrollbar: 'u-Scrollable-scrollbar',
    classNameTrack: 'u-Scrollable-track'
  }
  static propTypes = {
    autoHide: PropTypes.bool,
    scrollbarMinSize: PropTypes.number,
    classNameContent: PropTypes.string,
    classNameScrollContent: PropTypes.string,
    classNameScrollbar: PropTypes.string,
    classNameTrack: PropTypes.string,
  }

  componentDidMount() {
    const {
      autoHide,
      scrollbarMinSize,
      classNameContent: content,
      classNameScrollContent : scrollContent,
      classNameScrollbar: scrollbar,
      classNameTrack: track
    } = this.props

    this.simpleBar = new SimpleBar(this.scrollerEl, {
      autoHide,
      scrollbarMinSize,
      classNames: { content, scrollContent, scrollbar, track }
    })
  }

  componentWillUnmount() {
    this.simpleBar.removeObserver()
  }

  render() {
    return (
      <div className={this.props.className} ref={ref => { this.scrollerEl = ref }}>
        {this.props.children}
      </div>
    )
  }
}

export default Scrollable
