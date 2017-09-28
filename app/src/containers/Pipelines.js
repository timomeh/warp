import React, { Component } from 'react'
import { connect } from 'react-redux'

import icons from 'bits/icons'
import PageTitle from 'components/PageTitle'

class Pipelines extends Component {
  render() {
    // const { pipelines } = this.props

    return (
      <div>
        <PageTitle icon={icons.pipeSideways} title="Pipelines" />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  pipelines: state.pipelines
})

export default connect(mapStateToProps)(Pipelines)
