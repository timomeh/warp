import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import { fetchProject } from 'lib/store'
import ProjectDashboard from 'containers/ProjectDashboard'

class Project extends Component {
  componentWillMount() {
    const { projectId } = this.props.match.params
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
