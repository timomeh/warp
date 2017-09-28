import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import { fetchProject } from 'lib/store'
import Socket from 'lib/socket'
import ProjectDashboard from 'containers/ProjectDashboard'

class Project extends Component {
  constructor(props) {
    super(props)
    this.socket = Socket.instance()
  }

  componentWillMount() {
    const { projectId } = this.props.match.params
    this.socket.joinProject(projectId)
    this.props.dispatch(fetchProject(projectId))
  }

  render() {
    const { project } = this.props

    return <div>
      {project.isFetching
        ? <div>Loading...</div>
        : this.renderRoutes()
      }
    </div>
  }

  renderRoutes = () => {
    return (
      <Switch>
        <Route path="/:projectId" component={ProjectDashboard} />
      </Switch>
    )
  }
}

const mapStateToProps = state => ({
  project: state.project,
  projects: state.projects
})

export default connect(mapStateToProps)(Project)
