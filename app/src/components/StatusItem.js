import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import StatusIndicator from 'components/StatusIndicator'
import { fontWeight } from 'bits/styles'

const Box = glamorous.div({
  background: '#FFFFFF',
  boxShadow: '0 1px 3px 0 rgba(0,0,0,0.20)',
  borderRadius: 2,
  height: 36,
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  overflow: 'hidden'
})

const StatusBox = glamorous.div(({ type }) => {
  const colors = {
    finished: '#8BC34A',
    active: '#FBC02D',
    errored: '#D32F2F',
    pending: '#C8C7C7'
  }

  return {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors[type]
  }
})

const PrimaryText = glamorous.div({
  fontSize: 14,
  lineHeight: 1,
  color: '#595959',
  marginLeft: 16,
  marginRight: 8,
  fontWeight: fontWeight.semibold
})

const SecondaryText = glamorous.div(({ alignRight }) => ({
  fontSize: 14,
  lineHeight: 1,
  color: '#929292',
  marginLeft: alignRight && 'auto',
  marginRight: 16,
  fontWeight: fontWeight.semibold,
}))

const StatusItem = props => {
  const { status, title, right, version } = props

  return (
    <Box>
      <StatusBox type={status}>
        <StatusIndicator type={status} />
      </StatusBox>
      <PrimaryText>{title}</PrimaryText>
      <SecondaryText>{version}</SecondaryText>
      <SecondaryText alignRight>{right}</SecondaryText>
    </Box>
  )
}

StatusItem.propTypes = {
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  right: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
}

export default StatusItem
