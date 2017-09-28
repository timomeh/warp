import React from 'react'
import glamorous from 'glamorous'

import icons from 'bits/icons'
import Icon from 'components/Icon'

const Container = glamorous.div({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center'
})

const LogoFull = props => {
  return (
    <Container>
      <Icon icon={icons.pipe} width={20} height={20} style={{ fill: '#FFFFFF', marginRight: 15 }} />
      <Icon icon={icons.warp} width={54} height={22} style={{ fill: '#FFFFFF' }} />
    </Container>
  )
}

export default LogoFull
