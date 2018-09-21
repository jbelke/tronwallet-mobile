import React from 'react'
import Swiper from 'react-native-swiper'
import { Image } from 'react-native'

import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import tl from '../../utils/i18n'

const FEATURES_IMAGES = [
  {title: tl.t('firstTime.swiper.security.title'), body: tl.t('firstTime.swiper.security.body'), source: require('../../assets/security.png')},
  {title: tl.t('firstTime.swiper.votes.title'), body: tl.t('firstTime.swiper.votes.body'), source: require('../../assets/votes.png')},
  {title: tl.t('firstTime.swiper.addressbook.title'), body: tl.t('firstTime.swiper.addressbook.body'), source: require('../../assets/address-book.png')},
  {title: tl.t('firstTime.swiper.multipleaccounts.title'), body: tl.t('firstTime.swiper.multipleaccounts.body'), source: require('../../assets/multiple-accounts.png')}
]

const featureView = FEATURES_IMAGES.map((feat, index) =>
  <Utils.View key={index} flex={1} align='center' justify='center'>
    <Image style={{width: 150, height: 150}} source={feat.source} />
    <Utils.View height={10} />
    <Utils.Text size='average'>{feat.title}</Utils.Text>
    <Utils.View height={14} />
    <Utils.Text lineHeight={18} size='smaller' align='center' font='regular' color={Colors.greyBlue}>{feat.body}</Utils.Text>
  </Utils.View>)

export default () => (
  <Swiper
    dotColor={'rgba(255,255,255,0.2)'}
    activeDotColor={Colors.primaryText}
    dotStyle={{marginLeft: 6, marginRight: 6}}
    activeDotStyle={{marginLeft: 6, marginRight: 6}}
    paginationStyle={{bottom: 10, justifyContent: 'flex-start', paddingLeft: 35}}
    style={{backgroundColor: Colors.background}}>
    {[
      <Utils.View padding={35} key={4} flex={1} justify='center'>
        <Utils.Text size='large'>{tl.t('firstTime.swiper.welcome.title')}</Utils.Text>
        <Utils.View height={14} />
        <Utils.Text size='small' font='regular' color={Colors.greyBlue}>
          { tl.t('firstTime.swiper.welcome.body')}
        </Utils.Text>
      </Utils.View>,
      ...featureView
    ]}
  </Swiper>
)
