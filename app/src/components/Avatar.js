import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

const Img = glamorous.img({
  display: 'block',
  borderRadius: 3,
  width: 20,
  height: 20
})

const Avatar = props => {
  const { url } = props

  return (
    <Img width={20} height={20} src={url} />
  )
}

Avatar.propTypes = {
  url: PropTypes.string.isRequired
}

export default Avatar
