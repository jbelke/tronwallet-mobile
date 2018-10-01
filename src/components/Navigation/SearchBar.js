import React from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

import * as Utils from '../Utils'
import { Colors } from '../DesignSystem'
import { SearchBarWrapper, SearchBar } from './elements'
import FontelloIcon from '../FontelloIcon'

const NavigationSearchBar = ({ onSearch, onClose }) => (
  <SearchBarWrapper>
    <FontelloIcon
      name='magnifier,-search,-discover,-zoom,-lens'
      color={Colors.greyBlue}
      size={16}
    />
    <Utils.HorizontalSpacer />
    <SearchBar
      autoCapitalize='none'
      autoCorrect={false}
      underlineColorAndroid='transparent'
      onChangeText={text => onSearch(text)}
      selectionColor={Colors.greyBlue}
      height={42}
      autoFocus
    />
    <TouchableOpacity onPress={onClose}>
      <FontelloIcon
        size={13}
        name='close'
        color={Colors.primaryText}
      />
    </TouchableOpacity>
  </SearchBarWrapper>
)
NavigationSearchBar.defaultProps = {
  disabled: false,
  title: 'Right Button'
}

NavigationSearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onClose: PropTypes.func
}

export default NavigationSearchBar
