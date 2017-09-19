import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import AppBar from './components/AppBar'
import SideBar from './components/SideBar'
import PageLayout from './components/PageLayout'
import Home from './screens/Home'

class App extends Component {
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

export default App
