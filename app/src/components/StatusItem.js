import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import StatusBox from 'components/StatusBox'
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
      <StatusBox type={status} />
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
