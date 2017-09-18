import React from 'react'
import PropTypes from 'prop-types'
import { Div } from 'glamorous'

import Logo from './Logo'

const AppBar = props => {
  return (
    <Div
      background="linear-gradient(to left top, #F9F7EE, #F8F7F2)"
      borderBottom="1px solid #EBE8DC"
      width="100%"
      height={60}
      display="flex"
      alignItems="center"
      padding="0 24px"
    >
      <Logo />
    </Div>
  )
}

AppBar.propTypes = {

}

export default AppBar

export function addToStorybook({ storiesOf }) {
  storiesOf('AppBar', module)
    .add('AppBar', () => <AppBar />)
}
