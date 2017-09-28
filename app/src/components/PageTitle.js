import React from 'react'
import glamorous from 'glamorous'
import PropTypes from 'prop-types'

import { fontWeight } from 'bits/styles'
import Icon from 'components/Icon'

const Headline = glamorous.h2({
  fontSize: 28,
  fontWeight: fontWeight.regular,
  color: '#929292',
  margin: 0,
  marginBottom: 32,
  display: 'flex',
  flexFlow: 'row wrap',
  alignItems: 'center'
})

const PageTitle = props => {
  const { title, icon } = props

  return (
    <Headline>
      <Icon icon={icon} width={32} height={32} style={{ fill: '#929292', marginRight: 16 }} />
      {title}
    </Headline>
  )
}

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired
}

export default PageTitle
