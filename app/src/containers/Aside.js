import React, { Component } from 'react'
import glamorous from 'glamorous'
import { connect } from 'react-redux'
import { NavLink as RRNavLink } from 'react-router-dom'

import icons from 'bits/icons'
import { fontWeight } from 'bits/styles'
import LogoFull from 'components/LogoFull'
import Icon from 'components/Icon'

const Brand = glamorous.div({
  backgroundColor: '#303030',
  color: '#FFFFFF',
  height: 64,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 22,
  marginBottom: 40
})

const NavList = glamorous.ul({
  padding: 0,
  margin: 0,
  listStyleType: 'none'
})

const NavLink = glamorous(RRNavLink)({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  paddingTop: 10,
  paddingBottom: 10,
  paddingLeft: 32,
  textDecoration: 'none',
  position: 'relative',
  '&.active ::after': {
    content: '""',
    position: 'absolute',
    left: -2,
    top: 4,
    bottom: 4,
    background: '#FFFFFF',
    boxShadow: '0 0 2px 1px rgba(255,255,255,0.75)',
    width: 3,
    borderRadius: 2,
  }
})

const NavText = glamorous.div({
  fontSize: 16,
  color: '#FFFFFF',
  fontWeight: fontWeight.semibold,
  marginLeft: 16
})

class Aside extends Component {
  render() {
    const { isFetching } = this.props

    return (
      <div>
        <Brand>
          <LogoFull />
        </Brand>
        {!isFetching && this.renderNav()}
      </div>
    )
  }

  renderNav = () => {
    const { projectId } = this.props

    return (
      <nav>
        <NavList>
          <li>
            <NavLink exact to={`/${projectId}`}>
              <Icon width={16} height={16} icon={icons.package} style={{ fill: 'white' }} />
              <NavText>Latest Builds</NavText>
            </NavLink>
            <NavLink to={`/${projectId}/pipelines`}>
              <Icon width={14} height={16} icon={icons.pipeSideways} style={{ fill: 'white' }} />
              <NavText>Pipelines</NavText>
            </NavLink>
            <NavLink to={`/${projectId}/build-history`}>
              <Icon width={16} height={16} icon={icons.history} style={{ fill: 'white' }} />
              <NavText>Build History</NavText>
            </NavLink>
            <NavLink to={`/${projectId}/settings`}>
              <Icon width={16} height={16} icon={icons.cog} style={{ fill: 'white' }} />
              <NavText>Settings</NavText>
            </NavLink>
          </li>
        </NavList>
      </nav>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.project.isFetching,
  projectId: state.project.selectedId
})

export default connect(mapStateToProps)(Aside)
