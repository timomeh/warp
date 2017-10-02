import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

const Flex = glamorous.div({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  height: 24
})

const Left = glamorous.div({
  width: 20,
  marginRight: 8,
  display: 'flex',
  justifyContent: 'center'
})

const Right = glamorous.div({
  color: '#595959',
  fontSize: 14,
  maxWidth: 'calc(100% - 40px)'
})

const IconText = props => {
  const { graphic, info } = props

  return (
    <Flex>
      <Left>{graphic}</Left>
      <Right>{info}</Right>
    </Flex>
  )
}

IconText.propTypes = {
  graphic: PropTypes.node.isRequired,
  info: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
}

export default IconText
