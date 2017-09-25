import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import moment from 'moment'

import { fontWeight } from 'bits/styles'
import Card from 'components/Card'
import StatusBar from 'components/StatusBar'
import InfoList from 'components/InfoList'
import StatusChip from 'components/StatusChip'
import CodeChip from 'components/CodeChip'
import Info from 'components/Info'
import Timer from 'components/Timer'
import MiniStepsList from 'components/MiniStepsList'

const Inner = glamorous.div({
  padding: 32
})

const Meta = glamorous.div({
  fontSize: 14,
  color: '#929292',
  marginBottom: 8,
  fontWeight: fontWeight.semibold
})

const BuildOverview = props => {
  const { build, pipeline, stages, steps } = props

  const time = ['success', 'failed'].includes(build.status)
    ? build.finished_at
    : build.started_at

  function timeToString(time) {
    return time
      ? moment(time).format("YYYY-MM-DD HH:mm:ss")
      : "–"
  }

  function timesToDuration(from, to) {
    if (from == null && to == null) return "–"
    else if (to == null) return <Timer datetime={from} />
    else return moment(moment(to).diff(moment(from))).format("mm:ss")
  }

  return (
    <Card>
      <StatusBar
        status={build.status}
        title={pipeline.title}
        time={time}
      />
      <Inner>
        <InfoList>
          <StatusChip status={build.status} />
          <Info name="Commit" value={<CodeChip>{build.commit_sha.substring(0,7)}</CodeChip>} />
          <Info name="Ref" value={<CodeChip>{build.ref}</CodeChip>} />
        </InfoList>
        <InfoList>
          <Info name="Duration" value={timesToDuration(build.started_at, build.finished_at)} />
          <Info name="Start Time" value={timeToString(build.started_at)} />
          <Info name="End Time" value={timeToString(build.finished_at)} />
        </InfoList>

        {stages.length > 0 &&
          <div>
            <Meta>All Build Steps</Meta>
            <MiniStepsList
              stages={stages}
              steps={steps}
            />
          </div>
        }
      </Inner>
    </Card>
  )
}

BuildOverview.propTypes = {
  build: PropTypes.object.isRequired,
  pipeline: PropTypes.object.isRequired,
  stages: PropTypes.array.isRequired,
  steps: PropTypes.object.isRequired
}

export default BuildOverview
