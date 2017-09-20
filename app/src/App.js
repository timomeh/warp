import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import Socket from 'lib/socket'
import AppBar from 'components/AppBar'
import SideBar from 'containers/SideBar'
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
  }

  render() {
    return (
      <Router>
        <PageLayout
          top={<AppBar />}
          aside={<SideBar />}
          main={
            <Route exact path="/" component={Home} />
          }
        />
      </Router>
    )
  }
}

export default connect()(App)
