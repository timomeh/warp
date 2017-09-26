import React, { Component } from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import moment from 'moment'

import { fontWeight } from 'bits/styles'
import { getStepLeaves } from 'lib/store'
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

class BuildOverview extends Component {
  state = {
    leafSteps: []
  }

  componentWillMount() {
    this.setLeafSteps(this.props.stages, this.props.steps)
  }

  componentWillReceiveProps(nextProps) {
    const { build: currentBuild } = this.props
    const { build: newBuild, stages, steps } = nextProps
    const { leafSteps } = this.state

    // If component updates with a new build, reset the state
    if (currentBuild.id !== newBuild.id) {
      this.setState({ leafSteps: [] })
    }

    // If new leafSteps are available, calculate and set them
    if (newBuild.status === 'active' && stages.length && leafSteps.length === 0) {
      this.setLeafSteps(stages, steps)
    }
  }

  render() {
    const { build, pipeline, steps } = this.props
    const { leafSteps } = this.state

    return (
      <Card>
        <StatusBar
          status={build.status}
          title={pipeline.title}
          startedAt={build.started_at}
          finishedAt={build.finished_at}
        />
        <Inner>
          <InfoList>
            <StatusChip status={build.status} />
            <Info
              name="Commit"
              value={<CodeChip>{build.commit_sha.substring(0,7)}</CodeChip>}
            />
            <Info
              name="Ref"
              value={<CodeChip>{build.ref}</CodeChip>}
            />
          </InfoList>
          <InfoList>
            <Info
              name="Duration"
              value={this.timesToDuration(build.started_at, build.finished_at)}
            />
            <Info
              name="Start Time"
              value={this.timeToString(build.started_at)}
            />
            <Info
              name="End Time"
              value={this.timeToString(build.finished_at)}
            />
          </InfoList>

          {leafSteps.length > 0 &&
            <div>
              <Meta>All Build Steps</Meta>
              <MiniStepsList
                steps={leafSteps.map(id => steps.entities[id])}
              />
            </div>
          }
        </Inner>
      </Card>
    )
  }

  setLeafSteps = (stages, steps) => {
    const leafSteps =
      stages
        .map(stage => getStepLeaves(stage.steps, steps.entities))
        .reduce((acc, cur) => acc.concat(cur), [])

    this.setState({ leafSteps })
  }

  timesToDuration = (from, to) => {
    if (from == null && to == null) return "–"
    else if (to == null) return <Timer datetime={from} />
    else return moment(moment(to).diff(moment(from))).format("mm:ss")
  }

  timeToString = (time) => {
    return time
      ? moment(time).format("YYYY-MM-DD HH:mm:ss")
      : "–"
  }
}

BuildOverview.propTypes = {
  build: PropTypes.object.isRequired,
  pipeline: PropTypes.object.isRequired,
  stages: PropTypes.array.isRequired,
  steps: PropTypes.object.isRequired
}

export default BuildOverview
