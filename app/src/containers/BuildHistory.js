import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { fetchBuildHistory } from 'lib/store'
import icons from 'bits/icons'
import PageTitle from 'components/PageTitle'
import DateSeparatedList from 'components/DateSeparatedList'
import Subtitle from 'components/Subtitle'
import Card from 'components/Card'
import StatusBar from 'components/StatusBar'

class BuildHistory extends Component {
  componentWillMount() {
    this.props.dispatch(fetchBuildHistory())
  }

  render() {
    const { isFetching, buildHistory, builds } = this.props

    return (
      <div>
        <PageTitle icon={icons.history} title="Build History" />
        {isFetching
          ? <div>Loading...</div>
          : <DateSeparatedList
              items={buildHistory}
              getCompareDate={id => builds[id].finished_at}
              renderDate={date => this.renderDay(date)}
              renderItem={id => this.renderBuild(id)}
            />
        }
      </div>
    )
  }

  renderDay = (date) => {
    const dayString = moment(date).format('dddd, Do MMMM YYYY')
    return <Subtitle>{dayString}</Subtitle>
  }

  renderBuild = (buildId) => {
    const { builds, pipelines } = this.props
    const build = builds[buildId]
    const pipeline = pipelines[build.pipeline_id]

    return (
      <Card>
        <StatusBar
          hasArrow
          status={build.status}
          title={pipeline.title}
          startedAt={build.started_at}
          finishedAt={build.finished_at}
          version={build.id}
        />
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  buildHistory: state.project.buildHistory,
  pipelines: state.pipelines.entities,
  builds: state.builds.entities,
  isFetching: state.project.isFetchingBuilds
})

export default connect(mapStateToProps)(BuildHistory)
