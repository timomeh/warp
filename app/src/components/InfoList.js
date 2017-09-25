import React from 'react'
import glamorous from 'glamorous'

const Row = glamorous.div({
  display: 'flex',
  flexFlow: 'row nowrap',
  marginBottom: 16,
  alignItems: 'center'
})

const Item = glamorous.div({
  marginRight: 16
})

const InfoList = props => {
  const { children } = props

  return (
    <Row>
      {React.Children.map(children, (child, i) => (
        <Item>{child}</Item>
      ))}
    </Row>
  )
}

export default InfoList
