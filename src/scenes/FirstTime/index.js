import React from 'react'
import { BackHandler } from 'react-native'

import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import { BlackButton } from './elements'
import tl from '../../utils/i18n'
import ButtonGradient from '../../components/ButtonGradient'
import { withContext } from '../../store/context'
import FeaturesSwiper from './FeaturesSwiper'
import ConfigJson from '../../../package.json'

class FirstTime extends React.Component {
  componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress)
  }

  _handleBackPress = () => {
    BackHandler.exitApp()
  }

  render () {
    const shouldDoubleCheck = this.props.navigation.getParam('shouldDoubleCheck')
    const testInput = this.props.navigation.getParam('testInput')
    return (
      <React.Fragment>
        <FeaturesSwiper />
        <Utils.View background={Colors.background} paddingHorizontal={30}>
          <Utils.View height={20} />
          <ButtonGradient
            text={tl.t('firstTime.button.create')}
            onPress={() => {
              this.props.navigation.navigate('Pin', {
                shouldDoubleCheck,
                testInput,
                onSuccess: async pin => {
                  this.props.context.setPin(
                    pin,
                    () => this.props.navigation.navigate('CreateSeed')
                  )
                }
              })
            }}
          />
          <Utils.VerticalSpacer />
          <ButtonGradient
            text={tl.t('firstTime.button.import')}
            onPress={() => {
              this.props.navigation.navigate('Pin', {
                shouldDoubleCheck,
                testInput,
                onSuccess: pin => this.props.context.setPin(pin, () => this.props.navigation.navigate('ImportWallet'))
              })
            }}
          />
          <Utils.VerticalSpacer />
          <BlackButton
            text={tl.t('firstTime.button.restore')}
            onPress={() => {
              this.props.navigation.navigate('Pin', {
                shouldDoubleCheck,
                testInput,
                onSuccess: pin => this.props.context.setPin(pin, () => this.props.navigation.navigate('SeedRestore'))
              })
            }}
          />
          <Utils.VersionText>{`v${ConfigJson.version}`}</Utils.VersionText>
        </Utils.View>
      </React.Fragment>
    )
  }
}

export default withContext(FirstTime)
