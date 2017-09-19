import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import Scrollable from './Scrollable'

const AppFrame = glamorous.div({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  height: '100vh',
  display: 'flex',
  flexFlow: 'column wrap'
})

const Top = glamorous.div({
  width: '100%'
})

const Content = glamorous.div({
  width: '100%',
  flex: 1,
  display: 'flex',
  flexFlow: 'row nowrap'
})

const Aside = glamorous(Scrollable)({
  width: 300,
  marginTop: -2,
  paddingTop: 2,
  marginBottom: -1,
  borderRight: '1px solid #EBE8DC'
})

const Main = glamorous(Scrollable)({
  flex: 1
})

const PageLayout = props => {
  const { top, aside, main } = props

  return (
    <AppFrame>
      <Top>{top}</Top>
      <Content>
        <Aside>{aside}</Aside>
        <Main>{main}</Main>
      </Content>
    </AppFrame>
  )
}

PageLayout.propTypes = {
  top: PropTypes.node.isRequired,
  aside: PropTypes.node.isRequired,
  main: PropTypes.node.isRequired
}

export default PageLayout
