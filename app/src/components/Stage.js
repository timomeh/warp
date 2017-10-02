import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import StageCard from 'components/StageCard'
import StepGroup from 'components/StepGroup'

const StepsContainer = glamorous.div({
  marginLeft: 48,
  marginTop: 16,
  marginBottom: 16
})

const Stage = props => {
  const { stage, num } = props

  return (
    <div>
      <StageCard
        status={stage.status}
        primary={stage.title}
        secondary={`Stage ${num+1}`}
      />
      <StepsContainer>
        <StepGroup group={stage} />
      </StepsContainer>
    </div>
  )
}

Stage.propTypes = {
  stage: PropTypes.object.isRequired,
  num: PropTypes.number.isRequired
}

export default Stage
