import React from 'react'
import glamorous from 'glamorous'
import { fontWeight, fontFamily } from '../styles'

const Title = glamorous.div({
  fontFamily,
  fontSize: 16,
  fontWeight: fontWeight.semibold,
  color: '#4E4A3B'
})

export default Title

export function stories({ storiesOf }) {
  storiesOf('Text', module)
    .add('Title', () => <Title>Hello World!</Title>)
}
