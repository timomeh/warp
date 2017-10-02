import React from 'react'
import PropTypes from 'prop-types'

import StageCard from 'components/StageCard'

const Stage = props => {
  const { stage, num } = props

  return (
    <div>
      <StageCard
        status={stage.status}
        primary={stage.title}
        secondary={`Stage ${num+1}`}
      />
    </div>
  )
}

Stage.propTypes = {
  stage: PropTypes.object.isRequired,
  num: PropTypes.number.isRequired
}

export default Stage
