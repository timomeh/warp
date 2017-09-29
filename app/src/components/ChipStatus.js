import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import { statusColors, fontWeight } from 'bits/styles'

const Chip = glamorous.div(({ status }) => ({
  backgroundColor: statusColors[status],
  borderRadius: 4,
  padding: '4px 12px',
  fontSize: 14,
  fontWeight: fontWeight.bold,
  color: ['success', 'failed'].includes(status) ? 'white' : 'rgba(0, 0, 0, 0.6)'
}))

const StatusChip = props => {
  const { status } = props

  function getStatusText(status) {
    switch (status) {
      case "queued": return "Build is queued"
      case "init": return "Build is initializing"
      case "active": return "Build is running"
      case "success": return "Build succeeded"
      case "failed": return "Build failed"
      default: return "Build is something"
    }
  }

  return <Chip status={status}>{getStatusText(status)}</Chip>
}

StatusChip.propTypes = {
  status: PropTypes.string.isRequired
}

export default StatusChip
