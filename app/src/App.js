import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchProjects } from 'lib/store'

import Socket from 'lib/socket'
import AppBar from 'components/AppBar'
import PageLayout from 'components/PageLayout'
import ProjectsList from 'containers/ProjectsList'
import Project from 'containers/Project'

class App extends Component {
  constructor(props) {
    super(props)

    this.socket = Socket.instance(props.dispatch)
  }

  componentWillMount() {
    //this.socket.joinGeneral()
    this.props.dispatch(fetchProjects())
  }

  componentWillUnmount() {
    //this.socket.leaveGeneral()
  }

  render() {
    return (
      <Router>
        <PageLayout
          top={<AppBar />}
          main={this.renderMain()}
        />
      </Router>
    )
  }

  renderMain() {
    return (
      <Switch>
        <Route exact path="/" component={ProjectsList} />
        <Route path="/projects/:projectId" component={Project} />
      </Switch>
    )
  }
}

export default connect()(App)
