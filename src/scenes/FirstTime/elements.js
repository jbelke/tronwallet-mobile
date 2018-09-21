import React from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import * as Utils from '../../components/Utils'
import { Colors, ButtonSize, ScreenSize } from '../../components/DesignSystem'
import Svg, {Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg'

export const BlackButton = ({onPress, text}) =>
  <TouchableOpacity
    onPress={onPress}
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: ButtonSize['large'],
      borderRadius: 4,
      backgroundColor: Colors.darkThree
    }}
  >
    <Svg height={80} width='100%'>
      <Defs>
        <RadialGradient id='grad' cx={(ScreenSize.width / 2) - 30} cy='0' rx='100' ry='75' fx='150' fy='75' gradientUnits='userSpaceOnUse'>
          <Stop
            offset='0'
            stopColor={Colors.buttonGradient[1]}
            stopOpacity='0.4'
          />
          <Stop
            offset='1'
            stopColor={Colors.darkThree}
            stopOpacity='0.1'
          />
        </RadialGradient>
      </Defs>
      <Ellipse cx='150' cy='0' rx='150' ry='75' fill='url(#grad)' />
    </Svg>
    <Utils.Text
      color={Colors.lemonYellow}
      style={{position: 'absolute', right: 10, left: 10}}
      align='center' size='button'>
      {text}
    </Utils.Text>
  </TouchableOpacity>

BlackButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}
