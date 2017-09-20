import React from 'react'
import PropTypes from 'prop-types'

const Logo = props => {
  const {
    color = "black"
  } = props

  return (
    <svg width="68" height="18" viewBox="0 0 68 18" xmlns="http://www.w3.org/2000/svg">
      <g fillRule="nonzero" fill={color}>
        <path d="M14.878 13.387c0 .774-.155 1.45-.478 2.025-.323.577-.76 1.055-1.322 1.435-.562.38-1.21.66-1.955.858-.745.197-1.532.295-2.362.295H0V0h10.012c.62 0 1.196.14 1.702.408.506.267.942.62 1.294 1.054.35.436.633.93.83 1.477.196.547.295 1.11.295 1.687 0 .857-.21 1.673-.647 2.432-.436.76-1.083 1.335-1.94 1.73 1.026.308 1.84.843 2.446 1.616.59.76.886 1.758.886 2.98zM4.162 3.544V7.27h4.08c.45 0 .856-.154 1.222-.45.352-.31.52-.773.52-1.42 0-.59-.154-1.055-.464-1.364-.31-.31-.69-.478-1.125-.478H4.163v-.014zm6.483 9c0-.563-.154-1.027-.478-1.42-.323-.394-.73-.577-1.223-.577H4.162v3.923h4.613c.548 0 .984-.183 1.35-.534.352-.352.52-.816.52-1.392zM29.995 14.344V18H17.34V0h12.416v3.656h-8.268v3.502h7.1v3.375h-7.1v3.81M39.29 6.258L35.115 18h-4.26L37.42 0h3.755l6.567 18h-4.26M63.717 18V7.228l-3.91 7.833h-2.235l-3.91-7.832V18H49.5V0h4.514l4.67 9.408L63.38 0h4.486v18"/>
      </g>
    </svg>
  )
}

Logo.propTypes = {
  color: PropTypes.string
}

export default Logo

export function stories({ storiesOf }) {
  storiesOf('Logo')
    .add('with default color', () => <Logo />)
    .add('with custom color', () => <Logo color="red" />)
}
