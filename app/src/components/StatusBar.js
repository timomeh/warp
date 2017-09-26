import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import { statusColors, fontWeight } from 'bits/styles'
import icons from 'bits/icons'
import Icon from 'components/Icon'
import StatusBox from 'components/StatusBox'
import Timer from 'components/Timer'
import TimeFromNow from 'components/TimeFromNow'

const ColoredBar = glamorous.div(({ status }) => ({
  backgroundColor: statusColors[status],
  backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.15), rgba(0,0,0,0.07))',
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

const Right = glamorous.div({
  fontWeight: fontWeight.bold,
  fontSize: 16,
  color: 'white',
  opacity: 0.75,
  marginLeft: 'auto',
  marginRight: 16,
  display: 'flex',
  alignItems: 'center'
})

const IconContainer = glamorous.div({
  marginLeft: 16
})

const StatusBar = props => {
  const { status, title, startedAt, finishedAt, hasArrow = true } = props

  const time = ['success', 'failed'].includes(status)
    ? finishedAt
    : startedAt

  return (
    <ColoredBar status={status}>
      <StatusBox type={status} big />
      <PrimaryText>{title}</PrimaryText>
      <Right>{time &&
        (status === 'active' || status === 'init')
        ? <Timer datetime={time} />
        : <TimeFromNow datetime={time} />}
        {hasArrow &&
          <IconContainer>
            <Icon
              icon={icons.arrowRight}
              width={14} height={13}
              style={{ fill: 'white' }}
            />
          </IconContainer>
        }
      </Right>
    </ColoredBar>
  )
}

StatusBar.propTypes = {
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  time: PropTypes.string,
  hasArrow: PropTypes.bool
}

export default StatusBar
