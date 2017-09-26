import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import { statusColors } from 'bits/styles'
import StatusIndicator from 'components/StatusIndicator'


const Bubble = glamorous.div(({ status }) => ({
  width: 16,
  height: 16,
  borderRadius: 8,
  backgroundColor: statusColors[status],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const MiniStatus = props => {
  const { status, title } = props

  return (
    <Bubble status={status} data-rh={title}>
      <StatusIndicator type={status} size={8} />
    </Bubble>
  )
}

MiniStatus.propTypes = {
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default MiniStatus
