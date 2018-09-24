import React from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

import { Spacing } from '../DesignSystem'
import FontelloIcon from '../FontelloIcon'
const ClearVotes = ({onPress, disabled}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: Spacing.medium
    }}>
    <FontelloIcon
      name='delete,-trash,-dust-bin,-remove,-recycle-bin'
      color='white'
      size={18}
    />
  </TouchableOpacity>
)

ClearVotes.propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}
export default ClearVotes
