import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProjects } from '../lib/store'

import ProjectOverviewList from '../components/ProjectOverviewList'

class SideBar extends Component {
  componentDidMount() {
    this.props.dispatch(fetchProjects())
  }

  render() {
    const { projects } = this.props

    if (projects.result == null) return <div>Loading</div>

    return (
      <ProjectOverviewList
        items={projects.result.map(id => projects.entities.projects[id])}
        renderItem={item => <div>{item.id}</div>}
      />
    )
  }
}

const mapStateToProps = state => ({
  projects: state.projects.items
})

export default connect(mapStateToProps)(SideBar)
