import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'

import * as Utils from '../../Utils'
import { formatNumber } from '../../../utils/numberUtils'
import formatUrl from '../../../utils/formatUrl'
import RankBadge from './LeftBadge'

const VoteItem = ({ item, index, disabled, voteCount, openModal }) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={openModal}>
      <Utils.VoteRow>
        <Utils.Row justify='space-between' align='center'>
          <Utils.Row align='center'>
            <RankBadge
              voted={voteCount && voteCount > 0}
              index={item.rank}
            />
            <Utils.Column>
              <Utils.Text size='smaller' secondary>
                {item.name ? item.name : formatUrl(item.url)}
              </Utils.Text>
              <Utils.Text lineHeight={20} size='xsmall'>
                {formatNumber(item.votes)}
              </Utils.Text>
            </Utils.Column>
          </Utils.Row>
          <Utils.Text>{voteCount || 0}</Utils.Text>
        </Utils.Row>
      </Utils.VoteRow>
    </TouchableOpacity>
  )
}

VoteItem.propTypes = {
  item: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  votes: PropTypes.number
}

export default VoteItem
