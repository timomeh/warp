import React, { Component } from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import moment from 'moment'

import { fontWeight } from 'bits/styles'
import { getStepLeaves } from 'lib/store'
import Card from 'components/Card'
import StatusBar from 'components/StatusBar'
import Link from 'components/Link'
import Timer from 'components/Timer'
import MiniStepsList from 'components/MiniStepsList'

const Inner = glamorous.div({
  padding: 32
})

const Meta = glamorous.div({
  fontSize: 14,
  color: '#929292',
  marginBottom: 8,
  marginTop: 16,
  fontWeight: fontWeight.semibold
})

class BuildOverview extends Component {
  static defaultProps = {
    stages: [],
    steps: {}
  }
  static propTypes = {
    build: PropTypes.object.isRequired,
    pipeline: PropTypes.object.isRequired,
    stages: PropTypes.array,
    steps: PropTypes.object
  }

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
    const { build, pipeline, steps, projectId } = this.props
    const { leafSteps } = this.state

    return (
      <Card>
        <Link bare to={`/projects/${projectId}/builds/${build.id}`}>
          <StatusBar
            hasArrow
            status={build.status}
            title={pipeline.title}
            version={build.id}
            startedAt={build.started_at}
            finishedAt={build.finished_at}
          />
        </Link>
        <Inner>


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

export default BuildOverview
