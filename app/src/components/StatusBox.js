import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import StatusIndicator from 'components/StatusIndicator'
import { statusColors } from 'bits/styles'

const Box = glamorous.div(({ type, big }) => ({
  width: big ? 48 : 36,
  height: big ? 48 : 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: statusColors[type]
}))

const StatusBox = props => {
  const { type, big = false  } = props

  return (
    <Box big={big} type={type}>
      <StatusIndicator type={type} />
    </Box>
  )
}

StatusBox.propTypes = {
  type: PropTypes.string.isRequired,
  big: PropTypes.bool
}

export default StatusBox
