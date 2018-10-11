import React from 'react'
import PropTypes from 'prop-types'

import * as Utils from '../Utils'
import { Colors } from '../DesignSystem'
import { SearchBarWrapper, SearchBar } from './elements'
import FontelloIcon from '../FontelloIcon'
import FontelloButton from '../FontelloButton'

const NavigationSearchBar = ({ onSearch, onClose }) => (
  <SearchBarWrapper>
    <Utils.View paddingBottom={3}>
      <FontelloIcon
        name='magnifier,-search,-discover,-zoom,-lens'
        color={Colors.greyBlue}
        size={16}
      />
    </Utils.View>
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
    <FontelloButton
      padding={10}
      onPress={onClose}
      size={13}
      name='close'
      color={Colors.primaryText}
    />
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
