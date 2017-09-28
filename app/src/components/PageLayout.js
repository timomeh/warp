import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

const AppFrame = glamorous.div({

})

const Left = glamorous.div({
  position: 'fixed',
  zIndex: 2,
  top: 0,
  left: 0,
  bottom: 0,
  width: 280,
  backgroundColor: '#474747',
  '::before': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 24,
    backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.33) 100%)'
  }
})

const Right = glamorous.div({
  marginLeft: 280,
  zIndex: 1
})

const Top = glamorous.div({
  position: 'fixed',
  zIndex: 1,
  top: 0,
  left: 280,
  right: 0,
  height: 64
})

const Content = glamorous.main({
  paddingTop: 64,
  width: '100%'
})

const PageLayout = props => {
  const { aside, top, main } = props

  return (
    <AppFrame>
      <Left>{aside}</Left>
      <Right>
        <Top>{top}</Top>
        <Content>{main}</Content>
      </Right>
    </AppFrame>
  )
}

PageLayout.propTypes = {
  top: PropTypes.node.isRequired,
  main: PropTypes.node.isRequired,
  aside: PropTypes.node.isRequired
}

export default PageLayout
