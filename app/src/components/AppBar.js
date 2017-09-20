import React from 'react'
import { Div } from 'glamorous'

import Link from 'components/Link'
import Logo from 'components/Logo'

const AppBar = props => {
  return (
    <Div
      background="#491A56"
      width="100%"
      height={60}
      display="flex"
      alignItems="center"
      justifyContent="center"
      boxShadow="0 4px 5px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.14)"
    >
      <Link blank to="/">
        <Logo color="white" />
      </Link>
    </Div>
  )
}

export default AppBar

export function stories({ storiesOf }) {
  storiesOf('AppBar', module)
    .add('AppBar', () => <AppBar />)
}
