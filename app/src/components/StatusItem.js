import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import StatusBox from 'components/StatusBox'
import { fontWeight } from 'bits/styles'
import TimeFromNow from 'components/TimeFromNow'
import Timer from 'components/Timer'

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
  const { status, title, startedAt, version } = props

  return (
    <Box>
      <StatusBox type={status} />
      <PrimaryText>{title}</PrimaryText>
      <SecondaryText>{version}</SecondaryText>
      <SecondaryText alignRight>
        {startedAt &&
          (status === 'active' || status === 'init')
          ? <Timer datetime={startedAt} />
          : <TimeFromNow datetime={startedAt} />
        }
      </SecondaryText>
    </Box>
  )
}

StatusItem.propTypes = {
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  startedAt: PropTypes.string
}

export default StatusItem
