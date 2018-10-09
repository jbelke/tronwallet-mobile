import React from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import Feather from 'react-native-vector-icons/Feather'

const ClearButton = ({onPress, padding, size, style}) => (
  <TouchableOpacity style={{padding, ...style}} onPress={onPress}>
    <Feather name='trash-2' color='white' size={size} />
  </TouchableOpacity>
)
ClearButton.defaultProps = {
  padding: 6,
  size: 18
}
ClearButton.propType = {
  onPress: PropTypes.func,
  padding: PropTypes.number,
  size: PropTypes.number
}

export default ClearButton
