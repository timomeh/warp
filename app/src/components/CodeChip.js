import glamorous from 'glamorous'

import { fontFamily } from 'bits/styles'

const CodeChip = glamorous.div({
  lineHeight: 1,
  backgroundColor: '#F1DDE4',
  borderRadius: 4,
  padding: '8px 8px 6px',
  margin: '0 2px',
  fontSize: 12,
  fontWeight: 500,
  fontFamily: fontFamily.code,
  color: '#D81B60',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

export default CodeChip
