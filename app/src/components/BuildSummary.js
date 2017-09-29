import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import moment from 'moment'

import utils from 'lib/utils'
import icons from 'bits/icons'
import Card from 'components/Card'
import ChipCommit from 'components/ChipCommit'
import ChipCode from 'components/ChipCode'
import Icon from 'components/Icon'
import StatusBox from 'components/StatusBox'
import InfoWithGraphic from 'components/InfoWithGraphic'
import InfoWithTitle from 'components/InfoWithTitle'
import InfoAsCommit from 'components/InfoAsCommit'

const Container = glamorous(Card)({
  height: 96,
  display: 'flex',
  flexFlow: 'row nowrap'
})

const Content = glamorous.div({
  padding: '20px 24px',
  fontSize: 14,
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  width: '100%'
})

const Block = glamorous.div({
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'space-between'
})

const BigBlock = glamorous(Block)({ flexBasis: '40%', width: '40%' })
const SmallBlock = glamorous(Block)({ flexBasis: '30%', width: '30%' })

const BuildSummary = props => {
  const { status, title, buildNo, userAvatar, userName, commitMessage, commitSha, datetime, duration, meanDuration, buildRef } = props

  const [refType, refName] = utils.parseRef(buildRef)

  return (
    <Container>
      <StatusBox status={status} />
      <Content>
        {/* Build Name and Sender */}
        <BigBlock>
          <InfoWithGraphic
            graphic={
              <Icon
                width={20}
                height={20}
                style={{ fill: '#6A6A6A'}}
                icon={icons.truck}
              />
            }
            info={<InfoWithTitle name={title} value={`#${buildNo}`} />}
          />
          <InfoAsCommit
            avatarUrl={userAvatar}
            userName={userName}
            message={commitMessage}
          />
        </BigBlock>

        {/* Time and Duration */}
        <SmallBlock>
          <InfoWithGraphic
            graphic={
              <Icon
                width={14}
                height={14}
                style={{ fill: '#6A6A6A'}}
                icon={icons.time}
              />
            }
            info={moment(datetime).format('YYYY-MM-DD HH:mm:ss')}
          />
          <InfoWithGraphic
            graphic={
              <Icon
                width={14}
                height={14}
                style={{ fill: '#6A6A6A'}}
                icon={icons.duration}
              />
            }
            info={`${duration} vs ${meanDuration}`}
          />
        </SmallBlock>

        {/* Commit and Ref */}
        <SmallBlock>
          <InfoWithGraphic
            graphic={
              <Icon
                width={14}
                height={14}
                style={{ fill: '#6A6A6A'}}
                icon={icons.commit}
              />
            }
            info={<ChipCommit sha={commitSha} />}
          />
          <InfoWithGraphic
            graphic={
              <Icon
                width={14}
                height={14}
                style={{ fill: '#6A6A6A'}}
                icon={icons[refType]}
              />
            }
            info={<ChipCode>{refName}</ChipCode>}
          />
        </SmallBlock>
      </Content>
    </Container>
  )
}

BuildSummary.propTypes = {
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  buildNo: PropTypes.number.isRequired,
  datetime: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  meanDuration: PropTypes.string.isRequired,
  commitSha: PropTypes.string.isRequired,
  commitMessage: PropTypes.string.isRequired,
  buildRef: PropTypes.string.isRequired,
  userAvatar: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired
}

export default BuildSummary
