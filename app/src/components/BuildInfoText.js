import React from 'react'
import PropTypes from 'prop-types'
import glamorous, { Div } from 'glamorous'

import { fontWeight } from 'bits/styles'

const TextContainer = glamorous.div({
  fontSize: 14,
  fontWeight: fontWeight.regular,
  color: '#8B8779'
})

const BuildInfoText = props => {
  const { description, value } = props

  return (
    <TextContainer>
      <Div display="inline-block">{description}:&nbsp;</Div>
      <Div display="inline-block">{value}</Div>
    </TextContainer>
  )
}

BuildInfoText.propTypes = {
  description: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([ PropTypes.node, PropTypes.string ]).isRequired
}

export default BuildInfoText
