import glamorous from 'glamorous'

import { statusColors } from 'bits/styles'

const StatusStrip = glamorous.div(({ status }) => ({
  width: 10,
  minWidth: 10,
  height: '100%',
  backgroundColor: statusColors[status]
}))

export default StatusStrip
