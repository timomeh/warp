import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import StatusIndicator from 'components/StatusIndicator'
import { statusColors } from 'bits/styles'

const Box = glamorous.div(({ status }) => ({
  width: 48,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: statusColors[status]
}))

const StatusBox = props => {
  const { status } = props

  return (
    <Box status={status}>
      <StatusIndicator status={status} />
    </Box>
  )
}

StatusBox.propTypes = {
  status: PropTypes.string.isRequired,
  big: PropTypes.bool
}

export default StatusBox
