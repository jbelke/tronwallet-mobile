import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import LinearGradient from 'react-native-linear-gradient'

import { Colors, Spacing } from '../DesignSystem'
import { Text } from '../Utils'

export const HeaderWrapper = styled.View`
  background-color:${Colors.background}
`
export const Header = styled.View`
  height: 64px;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  justify-content: center;
  padding: ${Spacing.medium}px;
  ${props => props.position && css`position: ${props.position}`};
  ${props => props.paddingTop && css` padding-top: ${props.paddingTop}px`};
  ${props => props.border && css`border-bottom-width: 1px`};
  ${props => props.border && css`border-bottom-color: black`};
`
export const SearchBarWrapper = styled.View`
    flex:1;
    align-items: center;
    flex-direction: row;
    padding: 5px;
`
export const SearchBar = styled.TextInput`
  font-family: Rubik-Medium;
  font-size: 16px;
  line-height: 18px;
  color: ${Colors.primaryText};
  flex: 1;
  width: 100%;
  padding: 8px;
`
export const SearchPreview = props =>
  <LinearGradient
    start={{ x: 0, y: 0.4 }}
    end={{ x: 0, y: 1 }}
    colors={[Colors.primaryGradient[0], Colors.primaryGradient[1]]}
    style={{width: '100%', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 8}}
  >
    <View style={{width: '100%', paddingLeft: 16, paddingVertical: 10, justifyContent: 'center', marginLeft: 8, backgroundColor: Colors.background}}>
      <Text letterSpacing={0.8} size='xsmall' color={Colors.greyBlue}>{props.preview}</Text>
    </View>
  </LinearGradient>

SearchPreview.propTypes = {
  preview: PropTypes.string.isRequired
}
SearchPreview.defaultProps = {
  preview: 'Put some preview title of the list here'
}
