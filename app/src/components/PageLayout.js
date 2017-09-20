import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

const AppFrame = glamorous.div({
  display: 'flex',
  justifyContent: 'center'
})

const Top = glamorous.header({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: 60
})

const Content = glamorous.main({
  paddingTop: 60,
  width: '100%',
  maxWidth: 740,
  margin: '0 16px'
})

const PageLayout = props => {
  const { top, main } = props

  return (
    <AppFrame>
      <Top>{top}</Top>
      <Content>{main}</Content>
    </AppFrame>
  )
}

PageLayout.propTypes = {
  top: PropTypes.node.isRequired,
  main: PropTypes.node.isRequired
}

export default PageLayout
