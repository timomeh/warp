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
  const { status } = props

  return (
    <Bubble status={status}>
      <StatusIndicator type={status} size={8} />
    </Bubble>
  )
}

MiniStatus.propTypes = {

}

export default MiniStatus
