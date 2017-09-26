import React from 'react'
import glamorous from 'glamorous'

const Row = glamorous.div(({ noMarginBottom }) => ({
  display: 'flex',
  flexFlow: 'row nowrap',
  marginBottom: noMarginBottom ? 0 : 16,
  alignItems: 'center'
}))

const Item = glamorous.div({
  marginRight: 16
})

const InfoList = props => {
  const { children, noMarginBottom = false } = props

  return (
    <Row noMarginBottom={noMarginBottom}>
      {React.Children.map(children, (child, i) => (
        <Item>{child}</Item>
      ))}
    </Row>
  )
}

export default InfoList
