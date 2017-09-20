import React from 'react'
import glamorous from 'glamorous'

import { fontWeight } from 'bits/styles'

const Title = glamorous.div({
  fontSize: 16,
  fontWeight: fontWeight.semibold,
  color: '#4E4A3B'
})

export default Title

export function stories({ storiesOf }) {
  storiesOf('Text', module)
    .add('Title', () => <Title>Hello World!</Title>)
}
