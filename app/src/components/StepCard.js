import React, { Component } from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import { fontWeight } from 'bits/styles'
import Card from 'components/Card'
import StatusStrip from 'components/StatusStrip'

const MainBar = glamorous.div({
  height: 48,
  paddingRight: 16,
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  color: '#595959',
  fontSize: 14,
  fontWeight: fontWeight.semibold
})

const Title = glamorous.div({
  marginLeft: 20,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden'
})

class StepCard extends Component {
  static propTypes = {
    step: PropTypes.object.isRequired
  }

  render() {
    const { step } = this.props

    return (
      <Card>
        <MainBar>
          <StatusStrip status={step.status} />
          <Title>{step.title}</Title>
        </MainBar>
      </Card>
    )
  }
}

export default StepCard
