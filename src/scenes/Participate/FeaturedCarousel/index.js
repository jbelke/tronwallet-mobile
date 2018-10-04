import React from 'react'
import { Image, Dimensions } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import ProgressBar from 'react-native-progress/Bar'
import moment from 'moment'

import { Colors } from '../../../components/DesignSystem'
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
  WhiteLabelText,
  GradientRow
} from '../Elements'
import {
  Row,
  View
} from '../../../components/Utils'

import { ONE_TRX } from '../../../services/client'
import { withContext } from '../../../store/context'
import tl from '../../../utils/i18n'

const screenWidth = Dimensions.get('window').width

class FeaturedCarousel extends React.Component {
  _getFeaturedImage = uri => {
    const defaultImage = require('../../../assets/icon.png')
    return uri ? { uri } : defaultImage
  }

  _renderItem = ({ item, index }) => {
    const { name, issuedPercentage, endTime, price, abbr, image } = item
    return (
      <CarouselCard>
        <View align='center' flex={1} borderRadius={4} borderColor='transparent'>
          <Image
            source={this._getFeaturedImage(image)}
            style={{height: 200, width: screenWidth * 0.9}}
            resizeMode='stretch'
          />
        </View>
        <GradientRow>
          <WhiteLabelText label={abbr} />
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
              onPress={() => { this.props.navigation.navigate('TokenInfo', { item }) }}
              elevation={8}>
              <ButtonText>{tl.t('buy').toUpperCase()}</ButtonText>
            </BuyButton>
          </View>
        </GradientRow>
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
        sliderWidth={screenWidth}
        itemWidth={screenWidth * 0.85}
        lockScrollWhileSnapping
        autoplay
        autoplayInterval={8000}
      />
    )
  }
}

export default withContext(FeaturedCarousel)
