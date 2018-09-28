import React from 'react'
import { Image, StyleSheet } from 'react-native'

import ButtonIconGradient from '../../components/ButtonIconGradient'

import * as Utils from '../../components/Utils'
import tl from '../../utils/i18n'
import FontelloIcon from '../../components/FontelloIcon'

const ICON_SIZE = 22

const BalanceNavigation = ({ navigation }) => {
  const navigateNext = next => navigation.navigate(next, {index: 0})

  return (
    <React.Fragment>
      <Utils.VerticalSpacer size='xsmall' />
      <Utils.Row>
        <ButtonIconGradient
          text={tl.t('makePayment.pay').toUpperCase()}
          icon={<Image
            source={require('../../assets/icon-scan.png')}
            style={styles.icon}
          />}
          full
          onPress={() => navigateNext('ScanPayScene')}
        />
        <ButtonIconGradient
          text={tl.t('send.title').toUpperCase()}
          full
          icon={<FontelloIcon name='send' color='white' size={ICON_SIZE} />}
          onPress={() => navigateNext('SendScene')}
        />
        <ButtonIconGradient
          text={tl.t('receive.title').toUpperCase()}
          full
          icon={<FontelloIcon name='qr-code' color='white' size={ICON_SIZE} />}
          onPress={() => navigateNext('PaymentsScene')}
        />
        <ButtonIconGradient
          text={tl.t('freeze.title').toUpperCase()}
          multiColumnButton={{x: 2, y: 3}}
          full
          icon={<FontelloIcon name='freeze' color='white' size={ICON_SIZE} />}
          onPress={() => navigateNext('FreezeScene')}
        />
      </Utils.Row>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  icon: {
    height: ICON_SIZE,
    width: ICON_SIZE
  }
})

export default BalanceNavigation
