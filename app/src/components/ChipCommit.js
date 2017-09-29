import React from 'react'
import PropTypes from 'prop-types'

import ChipCode from 'components/ChipCode'

const ChipCommit = props => {
  const { sha } = props

  return (
    <ChipCode>{sha.substr(0, 7)}</ChipCode>
  )
}

ChipCommit.propTypes = {
  sha: PropTypes.string.isRequired
}

export default ChipCommit
