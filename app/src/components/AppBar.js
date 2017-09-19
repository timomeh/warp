import React from 'react'
import { Div } from 'glamorous'

import Logo from './Logo'

const AppBar = props => {
  return (
    <Div
      background="linear-gradient(to left top, rgba(248, 247, 242, 0.95), rgba(249, 247, 238, 0.95))"
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

export default AppBar

export function stories({ storiesOf }) {
  storiesOf('AppBar', module)
    .add('AppBar', () => <AppBar />)
}
