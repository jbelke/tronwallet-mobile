import React from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

import { Colors } from './DesignSystem'
import FontelloIcon from './FontelloIcon'

const FontelloButton = ({padding, size, name, onPress, color, style}) => (
  <TouchableOpacity
    style={[{padding: padding}, style]}
    onPress={onPress}>
    <FontelloIcon
      name={name}
      size={size}
      color={color}
    />
  </TouchableOpacity>
)

FontelloButton.defaultProps = {
  color: Colors.primaryText,
  padding: 0
}

FontelloButton.propTypes = {
  padding: PropTypes.number,
  size: PropTypes.number,
  name: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  color: PropTypes.string,
  style: PropTypes.object
}

export default FontelloButton
