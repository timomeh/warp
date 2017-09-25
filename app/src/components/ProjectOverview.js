import React, { Component } from 'react'
import PropTypes from 'prop-types'
import glamorous, { Div } from 'glamorous'

import Socket from 'lib/socket'
import { fontWeight } from 'bits/styles'
import Title from 'components/Title'
import Card from 'components/Card'
import StatusList from 'components/StatusList'
import StatusBar from 'components/StatusBar'
import Link from 'components/Link'

const Meta = glamorous.div({
  fontSize: 14,
  color: '#929292',
  marginBottom: 16,
  marginTop: 16,
  fontWeight: fontWeight.semibold
})

class ProjectOverview extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    builds: PropTypes.object.isRequired,
    pipelines: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.socket = Socket.instance()
  }

  componentWillMount() {
    this.socket.joinProject(this.props.project.id)
  }

  componentWillUnmount() {
    this.socket.leaveProject(this.props.project.id)
  }

  render() {
    const { project, builds, pipelines } = this.props

    return (
      <Card>
        <Div padding={32}>
          <Link bare to={`/projects/${project.id}`}>
            <Title>{project.name}</Title>
          </Link>
          <Meta>Latest Builds</Meta>
          <StatusList
            items={project.latest_builds.map(id => builds[id])}
            renderItem={build => (
              <Link bare to={`/projects/${project.id}/builds/${build.id}`}>
                <StatusBar
                  status={build.status}
                  title={pipelines[build.pipeline_id].title}
                  version={build.ref}
                  startedAt={build.started_at}
                />
              </Link>
            )}
          />
        </Div>
      </Card>
    )
  }
}

export default ProjectOverview
