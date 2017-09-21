import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import { statusColors, fontWeight } from 'bits/styles'
import StatusBox from 'components/StatusBox'

const ColoredBar = glamorous.div(({ status }) => ({
  backgroundColor: statusColors[status],
  backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.15), rgba(0,0,0,0.07))',
  height: 48,
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center'
}))

const PrimaryText = glamorous.div({
  fontWeight: fontWeight.bold,
  fontSize: 16,
  color: '#FFFFFF',
  marginLeft: 16
})

const RightText = glamorous.div({
  fontWeight: fontWeight.bold,
  fontSize: 16,
  color: 'rgba(255,255,255,0.74)',
  marginLeft: 'auto',
  marginRight: 16
})

const StatusBar = props => {
  const { status, primaryText, right } = props

  return (
    <ColoredBar status={status}>
      <StatusBox type={status} big />
      <PrimaryText>{primaryText}</PrimaryText>
      <RightText>{right}</RightText>
    </ColoredBar>
  )
}

StatusBar.propTypes = {
  status: PropTypes.string.isRequired,
  primaryText: PropTypes.string.isRequired,
  right: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
}

export default StatusBar
