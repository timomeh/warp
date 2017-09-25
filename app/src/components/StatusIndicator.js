import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import { css } from 'glamor'

import Icon from 'components/Icon'
import icons from 'bits/icons'

const rotate = css.keyframes({
  'from': { transform: 'rotate(0deg)' },
  'to': { transform: 'rotate(360deg)' }
})

const Pending = glamorous.div({
  display: 'inline-block',
  width: 16,
  height: 16,
  borderRadius: '50%',
  border: '3px solid white'
})

const Active = glamorous.div({
  display: 'inline-block',
  width: 16,
  height: 16,
  borderRadius: '50%',
  border: '3px solid rgba(255, 255, 255, 0.5)',
  borderLeft: '3px solid #FFFFFF',
  animation: `${rotate} 1s infinite linear`
})

const StatusIndicator = props => {
  const { type } = props

  switch (type) {
    case "success":
      return <Icon icon={icons.checkmark} width={16} height={13} style={{ fill: 'white' }} />
    case "pending":
      return <Pending />
    case "init":
    case "active":
      return <Active />
    case "queued":
      return <Icon icon={icons.hourglass} width={16} height={16} style={{ fill: 'white' }} />
    case "failed":
      return <Icon icon={icons.times} width={16} height={16} style={{ fill: 'white' }} />
    default:
      return <div>?</div>
  }
}



StatusIndicator.propTypes = {
  type: PropTypes.string.isRequired
}

export default StatusIndicator

export function stories({ storiesOf }) {
  storiesOf('StatusIndicator', module)
    .add('finished', () => <StatusIndicator type="finished" />)
    .add('pending', () => <StatusIndicator type="pending" />)
    .add('active', () => <StatusIndicator type="active" />)
    .add('errored', () => <StatusIndicator type="errored" />)
}
