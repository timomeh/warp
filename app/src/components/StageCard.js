import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import { fontWeight } from 'bits/styles'
import Card from 'components/Card'
import StatusBox from 'components/StatusBox'

const Outer = glamorous(Card)({
  height: 80,
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center'
})

const Text = glamorous.div({
  marginLeft: 25
})

const Secondary = glamorous.div({
  fontWeight: fontWeight.semibold,
  color: '#8F8F8F',
  fontSize: 14
})

const Primary = glamorous.div({
  fontWeight: fontWeight.semibold,
  color: '#595959',
  fontSize: 20
})

const StageCard = props => {
  const { primary, secondary, status } = props

  return (
    <Outer>
      <StatusBox status={status} />
      <Text>
        <Secondary>{secondary}</Secondary>
        <Primary>{primary}</Primary>
      </Text>
    </Outer>
  )
}

StageCard.propTypes = {
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired
}

export default StageCard
