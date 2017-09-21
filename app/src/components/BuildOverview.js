import React from 'react'
import PropTypes from 'prop-types'

import Card from 'components/Card'
import StatusBar from 'components/StatusBar'
import TimeFromNow from 'components/TimeFromNow'

const BuildOverview = props => {
  const { build } = props

  return (
    <Card>
      <StatusBar
        status={build.state}
        primaryText={build.type}
        right={<TimeFromNow datetime={build.started_at} key={build.id} />}
      />
    </Card>
  )
}

BuildOverview.propTypes = {
  build: PropTypes.object.isRequired
}

export default BuildOverview
