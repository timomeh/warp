import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchProjects } from 'lib/store'

import Socket from 'lib/socket'
import AppBar from 'components/AppBar'
import PageLayout from 'components/PageLayout'
import Home from 'screens/Home'

class App extends Component {
  constructor(props) {
    super(props)

    this.socket = new Socket(props.dispatch)
  }

  componentWillMount() {
    this.socket.connect()
    this.socket.join("room:lobby")
    this.props.dispatch(fetchProjects())
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
        <Route exact path="/" component={Home} />
        <Route path="/projects/:id" component={Home} />
      </Switch>
    )
  }
}

export default connect()(App)
