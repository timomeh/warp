import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import { css, after, plugins } from 'glamor'
import { ReactHintFactory } from 'react-hint'

import MiniStatus from 'components/MiniStatus'

plugins.add(({ style, selector }) => ({
  style, selector: selector.replace(/,\s?\[[^.,]+/g, ''),
}))

const showHint = css.keyframes({
  'from': { opacity: 0, transform: 'translateY(-3px)' },
  'to': { opacity: 1, transform: 'translateY(0)' }
})

const ReactHint = ReactHintFactory(React)

const hintClass = css({
  padding: 5,
  position: 'absolute',
  paddingBottom: 10,
  zIndex: 2,
  cursor: 'default',
  animation: `${showHint} 200ms`,
  '&__content': {
    whiteSpace: 'nowrap',
    padding: 10,
    borderRadius: 6,
    background: 'rgba(0,0,0,0.7)',
    color: 'white',
    fontSize: 14
  },
},
after({
  content: '""',
  position: 'absolute',
  bottom: 4,
  left: '50%',
  marginLeft: -7,
  display: 'block',
  width: 0,
  height: 0,
  borderLeft: '7px solid transparent',
  borderRight: '7px solid transparent',
  borderTop: '6px solid rgba(0,0,0,0.7)',
}))


const Row = glamorous.div({
  display: 'flex',
  flexFlow: 'row wrap'
})

const Item = glamorous.div({
  marginRight: 4
})

const MiniStepsList = props => {
  const { steps } = props

  return (
    <Row>
      <ReactHint events delay={30} className={hintClass.toString()}/>
      {steps.map(step => (
        <Item key={step.id}>
          <MiniStatus status={step.status} title={step.title} />
        </Item>
      ))}
    </Row>
  )
}

MiniStepsList.propTypes = {
  steps: PropTypes.array.isRequired
}

export default MiniStepsList
