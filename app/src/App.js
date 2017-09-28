import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import { fetchProjects, fetchProject } from 'lib/store'
import Socket from 'lib/socket'
import AppBar from 'containers/AppBar'
import PageLayout from 'components/PageLayout'
import Project from 'containers/Project'
import ProjectRedirect from 'containers/ProjectRedirect'
import Build from 'containers/Build'
import Aside from 'containers/Aside'

class App extends Component {
  constructor(props) {
    super(props)

    this.socket = Socket.instance(props.dispatch)
  }

  componentWillMount() {
    this.props.fetchProjectsAndSelectFirst()
    //this.socket.joinGeneral()
  }

  componentWillUnmount() {
    //this.socket.leaveGeneral()
  }

  render() {
    return (
      <Router>
        <PageLayout
          aside={<Aside />}
          top={<AppBar />}
          main={this.renderMain()}
        />
      </Router>
    )
  }

  renderMain() {
    return (
      <Switch>
        <Route exact path="/" component={ProjectRedirect} />
        <Route exact path="/:projectId" component={Project} />
        <Route path="/:projectId/builds/:buildId" component={Build} />
        <Route path="/:projectId" component={Project} />
      </Switch>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchProjectsAndSelectFirst() {
    dispatch(fetchProjects())
    .then(projectIds => dispatch(fetchProject(projectIds[0])))
  }
})

export default connect(null, mapDispatchToProps)(App)
