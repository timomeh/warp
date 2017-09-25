import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import { getStepLeaves } from 'lib/store'
import MiniStatus from 'components/MiniStatus'

const Row = glamorous.div({
  display: 'flex',
  flexFlow: 'row wrap'
})

const Item = glamorous.div({
  marginRight: 4
})

const MiniStepsList = props => {
  const { stages, steps } = props

  const leafSteps =
    stages
      .map(stage => getStepLeaves(stage.steps, steps.entities))
      .reduce((acc, cur) => acc.concat(cur), [])
      .map(id => steps.entities[id])

  return (
    <Row>
      {leafSteps.map(step => (
        <Item key={step.id}>
          <MiniStatus status={step.status} />
        </Item>
      ))}
    </Row>
  )
}

MiniStepsList.propTypes = {
  stages: PropTypes.array,
  steps: PropTypes.object
}

export default MiniStepsList
