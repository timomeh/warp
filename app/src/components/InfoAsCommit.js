import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'

import InfoWithGraphic from 'components/InfoWithGraphic'
import InfoWithTitle from 'components/InfoWithTitle'
import Avatar from 'components/Avatar'

const Ellipsis = glamorous.div({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap'
})

const InfoAsCommit = props => {
  const { avatarUrl, userName, message } = props

  return (
    <InfoWithGraphic
      graphic={<Avatar url={avatarUrl} />}
      info={
        <InfoWithTitle
          name={`${userName}:`}
          value={<Ellipsis>{message}</Ellipsis>}
        />
      }
    />
  )
}

InfoAsCommit.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
}

export default InfoAsCommit
