import React, { Component } from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import { Collapse } from 'react-collapse'

import icons from 'bits/icons'
import { fontWeight } from 'bits/styles'
import Card from 'components/Card'
import StatusStrip from 'components/StatusStrip'
import IconButton from 'components/IconButton'

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

const Right = glamorous.div({
  marginLeft: 'auto',
  marginRight: -8
})

const ExpandedContent = glamorous.div({
  borderTop: '1px solid rgba(0,0,0,0.09)',
  padding: 8
})

class StepCard extends Component {
  static propTypes = {
    step: PropTypes.object.isRequired
  }

  state = {
    collapsed: true
  }

  render() {
    const { step } = this.props
    const { collapsed } = this.state

    return (
      <Card>
        <MainBar>
          <StatusStrip status={step.status} />
          <Title>{step.title}</Title>
          <Right>
            <IconButton
              icon={icons.terminal}
              color={collapsed ? '#CBCBCB' : '#969696'}
              onClick={this.handleTerminalIconClick}
            />
          </Right>
        </MainBar>
        <Collapse isOpened={!collapsed}>
          <ExpandedContent>
          </ExpandedContent>
        </Collapse>
      </Card>
    )
  }

  handleTerminalIconClick = () => {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }))
  }
}

export default StepCard
