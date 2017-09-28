import React from 'react'
import glamorous from 'glamorous'

import LogoFull from 'components/LogoFull'

const Brand = glamorous.div({
  backgroundColor: '#303030',
  color: '#FFFFFF',
  height: 64,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 22
})

const Aside = props => {
  return (
    <div>
      <Brand>
        <LogoFull />
      </Brand>
    </div>
  )
}

Aside.propTypes = {

}

export default Aside
