import React from 'react'
import { Image, Dimensions } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import ProgressBar from 'react-native-progress/Bar'
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient'
import { Colors } from '../../../components/DesignSystem'

import { ONE_TRX } from '../../../services/client'
import { withContext } from '../../../store/context'
import tl from '../../../utils/i18n'

import {
  TokenPrice,
  Featured,
  Text,
  TokenName,
  VerticalSpacer,
  FeaturedText,
  HorizontalSpacer,
  BuyButton,
  ButtonText,
  CarouselCard,
  LabelText
} from '../Elements'

import {
  Row,
  View
} from '../../../components/Utils'

const getFeaturedImage = name => {
  const defaultImage = require('../../../assets/logo-circle.png')
  return defaultImage
}

class FeaturedCarousel extends React.Component {
  _renderItem = ({ item, index }) => {
    const { name, issuedPercentage, endTime, price, abbr } = item
    return (
      <CarouselCard>
        <Image
          source={getFeaturedImage(name)}
          style={{height: 230, width: 230, alignSelf: 'center'}}
          resizeMode='stretch'
        />
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          colors={[Colors.buttonGradient[2], Colors.buttonGradient[4]]}
          style={{flex: 1, padding: 10, borderBottomRightRadius: 4, borderBottomLeftRadius: 4, flexDirection: 'row'}}>
          <View borderRadius={4} background='white' align='center' justify='center' height={60} width={60}>
            <LabelText
              style={{color: Colors.buttonGradient[2]}}
              size='large'
              font='bold'>
              {abbr.substr(0, 3).toUpperCase()}
            </LabelText>
          </View>
          <HorizontalSpacer size={14} />
          <View flex={1} justify='space-between'>
            <TokenName>{name}</TokenName>
            <View>
              <ProgressBar
                progress={Math.round(issuedPercentage) / 100}
                borderWidth={0}
                width={null}
                height={4}
                color={Colors.weirdGreen}
                unfilledColor={Colors.dusk}
              />
              <VerticalSpacer size={6} />
              <Row justify='space-between'>
                <Text>{tl.t('ends')} {moment(endTime).fromNow()}</Text>
                <Text>{Math.round(issuedPercentage)}%</Text>
              </Row>
            </View>
          </View>
          <View flex={1} align='flex-end' justify='space-between'>
            <TokenPrice>{price / ONE_TRX} TRX</TokenPrice>
            <BuyButton
              onPress={() => { this.props.navigation.navigate('Buy', { item }) }}
              elevation={8}>
              <ButtonText>{tl.t('participate.button.buy')}</ButtonText>
            </BuyButton>
          </View>
        </LinearGradient>
        <Featured>
          <FeaturedText align='center'>{tl.t('participate.featured')}</FeaturedText>
        </Featured>
      </CarouselCard>
    )
  }

  render () {
    const { tokens } = this.props
    return (
      <Carousel
        ref={ref => { this.carousel = ref }}
        layout='default'
        data={tokens}
        renderItem={this._renderItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width * 0.85}
      />
    )
  }
}

export default withContext(FeaturedCarousel)
