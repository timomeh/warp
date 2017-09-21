import React from 'react'
import glamorous from 'glamorous'

import { fontWeight } from 'bits/styles'

const Title = glamorous.h3({
  fontSize: 20,
  fontWeight: fontWeight.semibold,
  color: '#491A56',
  margin: 0
})

export default Title

export function stories({ storiesOf }) {
  storiesOf('Text', module)
    .add('Title', () => <Title>Hello World!</Title>)
}
