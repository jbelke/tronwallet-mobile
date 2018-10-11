import React from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { Colors } from '../DesignSystem'
import Ionicons from 'react-native-vector-icons/Ionicons'

import * as Utils from '../Utils'
import { Header, HeaderWrapper, SearchPreview } from './elements'
import NavigationSearchBar from './SearchBar'
import FontelloButton from '../FontelloButton'
class NavigationHeader extends React.Component {
  /*
     onClose = Right Button with X
     onBack = Left Button with <
     onSearch = Right Button with magnifying glass
   */
  static propTypes = {
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    onBack: PropTypes.func,
    onSearch: PropTypes.func,
    onSearchPressed: PropTypes.func,
    searchPreview: PropTypes.string,
    noBorder: PropTypes.bool,
    rightButton: PropTypes.element,
    leftButton: PropTypes.element
  }

  state = {
    isSearching: false
  }

  _renderLeftElement = (onBack, leftButton) => {
    let element = null

    if (onBack && !leftButton) {
      element = <TouchableOpacity
        style={{padding: 12}}
        onPress={onBack} testID='HeaderBack'>
        <Ionicons
          name='ios-arrow-round-back'
          size={36}
          color={Colors.primaryText}
        />
      </TouchableOpacity>
    } else {
      element = leftButton
    }
    return <Utils.View margin={5} position='absolute' left={10}>
      {element}
    </Utils.View>
  }

  _renderRightElement = (onClose, onSearch, onSearchPressed, rightButton) => {
    let element = null
    if (onClose) {
      element = <FontelloButton onPress={onClose} name='close' size={13} />
    } else if (onSearch) {
      element =
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => {
            if (onSearchPressed) onSearchPressed()
          }}>
          <Ionicons name='ios-search' color='white' size={21} />
        </TouchableOpacity>
    } else {
      element = rightButton
    }

    return <Utils.View margin={10} position='absolute' right={10}>
      {element}
    </Utils.View>
  }

  _renderDefaultMode = () => {
    const { title, onClose, rightButton, onBack, leftButton, onSearch, onSearchPressed } = this.props

    return (
      <React.Fragment>
        {this._renderLeftElement(onBack, leftButton)}
        <Utils.View justify='center' align='center'>
          <Utils.Text lineHeight={36} size='average' font='medium'>{title.toUpperCase()}</Utils.Text>
        </Utils.View >
        {this._renderRightElement(onClose, onSearch, onSearchPressed, rightButton)}
      </React.Fragment>
    )
  }

  _renderSeachMode = () => {
    const { onSearch, onSearchPressed } = this.props
    const onClose = () => {
      if (onSearchPressed) onSearchPressed()
    }
    return <NavigationSearchBar onSearch={onSearch} onClose={onClose} />
  }

  render () {
    const { isSearching } = this.props

    return (
      <HeaderWrapper>
        <Header border={isSearching}>
          {
            isSearching
              ? this._renderSeachMode()
              : this._renderDefaultMode()}
        </Header>
        {
          isSearching
            ? <SearchPreview preview={this.props.searchPreview} />
            : null
        }
      </HeaderWrapper>
    )
  }
}

export default NavigationHeader
