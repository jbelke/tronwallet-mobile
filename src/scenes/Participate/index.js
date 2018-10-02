import React from 'react'
import { Answers } from 'react-native-fabric'
import {Image, FlatList, ActivityIndicator, Platform} from 'react-native'
import ProgressBar from 'react-native-progress/Bar'
import moment from 'moment'
import { debounce, union } from 'lodash'

import tl from '../../utils/i18n'
import getAssetsStore from '../../store/assets'
import { Colors } from '../../components/DesignSystem'
import { orderAssets, updateAssets, getCustomName } from '../../utils/assetsUtils'
import { ONE_TRX } from '../../services/client'
import guarantee from '../../assets/guarantee.png'
import NavigationHeader from '../../components/Navigation/Header'
import { logSentry } from '../../utils/sentryUtils'
import { withContext } from '../../store/context'
import {
  View,
  Container,
  Row
} from '../../components/Utils'

import {
  Card,
  TokenPrice,
  Text,
  TokenName,
  VerticalSpacer,
  FeaturedTokenName,
  HorizontalSpacer,
  BuyButton,
  ButtonText,
  TokensTitle,
  TokenLabel,
  TronIcon
} from './Elements'

import FeaturedCarousel from './FeaturedCarousel'
import {getFixedTokens} from '../../services/contentful'

const AMOUNT_TO_FETCH = 30

class ParticipateHome extends React.Component {
  static navigationOptions = () => {
    return { header: null }
  }

  state = {
    assetList: [],
    currentList: [],
    featuredTokens: [],
    fixedTokens: ['TRX'],
    verifiedTokens: [],
    start: 0,
    loading: false,
    searchMode: false,
    searchName: ''
  }

  async componentDidMount () {
    Answers.logContentView('Tab', 'Participate')
    this._onSearching = debounce(this._onSearching, 250)
    this._loadContentful = debounce(this._loadContentful, 1000)
    this._loadContentful()
    this._navListener = this.props.navigation.addListener('didFocus', this._loadContentful)
  }

  _setFeaturedTokensFromStore = async featuredTokens => {
    const filteredStore = this.assetStoreRef.objects('Asset')
    const featuredFromStore = featuredTokens
      .map(feat => {
        const tk = filteredStore.find(verified => verified.name === feat.name)
        if (tk) return {...tk, coverImage: feat.image, featured: true, verified: true}
      })

    this.setState({ featuredTokens: featuredFromStore })
  }

  _getVerifiedTokensFromStore = verifiedTokens => {
    const verified = this.assetStoreRef.objects('Asset')
    const verifiedAssets = verifiedTokens
      .map(tokenName => {
        const ve = verified.find(verified => verified.name === tokenName)
        return {...ve, verified: true}
      })
    return verifiedAssets.length ? verifiedAssets : []
  }

  _loadContentful = async () => {
    this.setState({loading: true, start: 0})
    try {
      this.assetStoreRef = await getAssetsStore()
      const { featuredTokens, verifiedTokens } = this.props.context.tokens
      this._setFeaturedTokensFromStore(featuredTokens)
      const verifiedList = this._getVerifiedTokensFromStore(verifiedTokens)
      // if (!this.props.context.verifiedTokensOnly) {
      //   const unVerifiedList = await this._updateAssets(0)
      //   const filteredUnVerified = this._filterOrderedAssets(unVerifiedList)

      //   const completeList = [...verifiedList, ...filteredUnVerified]
      //   this.setState({
      //     fixedTokens,
      //     currentList: completeList,
      //     asset: unVerifiedList,
      //     verifiedTokens: verified
      //   })
      // } else {

      this.setState({
        currentList: verifiedList,
        asset: verifiedList,
        verifiedTokens: verifiedTokens
      })
      // }
      // const unVerifiedList = await this._updateAssets(0)
      // const filteredUnVerified = this._filterOrderedAssets(unVerifiedList)

      // const currentList = verifiedTokensOnly ? verifiedList : [...verifiedList, ...filteredUnVerified]
    } catch (error) {
      // console.warn('error', error.message)
      // TO DO - make a error handler
    } finally {
      this.setState({loading: false})
    }
  }

  _loadMore = async () => {
    const { start, assetList, searchMode, loading } = this.state
    const { verifiedTokensOnly } = this.props.context
    const { verifiedTokens } = this.props.context.tokens

    if (loading || searchMode || verifiedTokensOnly) return

    this.setState({ loading: true })

    try {
      const assets = await this._updateAssets(start, start + AMOUNT_TO_FETCH)
      const updatedAssets = this._filterOrderedAssets(union(assetList, assets))
      const newStart = start + AMOUNT_TO_FETCH

      const verifiedList = this._getVerifiedTokensFromStore(verifiedTokens)
      const newList = [...verifiedList, ...updatedAssets]

      this.setState({ start: newStart, assetList: updatedAssets, currentList: newList })
    } catch (error) {
      this.setState({ error: error.message })
      logSentry(error, 'Participate - Load more candidates')
    } finally {
      this.setState({ loading: false })
    }
  }

  _updateAssets = async (start, end = AMOUNT_TO_FETCH, name) => {
    const assets = await updateAssets(start, end, name)
    const filteredAssets = this._filterOrderedAssets(assets)
    return filteredAssets
  }

  _filterOrderedAssets = assets => assets
    .filter(({ issuedPercentage, name, startTime, endTime }) =>
      issuedPercentage < 100 && startTime < Date.now() &&
    endTime > Date.now() && !this.props.context.tokens.fixedTokens.includes(name))
    .sort((a, b) => b.issuedPercentage - a.issuedPercentage)

  _onSearchPressed = () => {
    const { searchMode, verifiedTokens } = this.state
    this.setState({ searchMode: !searchMode, searchName: '' })

    if (searchMode) {
      const verified = this._getVerifiedTokensFromStore(verifiedTokens)
      this.setState({ currentList: verified, start: 0 })
    } else {
      this.setState({ currentList: [] })
    }
  }

  _onSearching = async name => {
    const { verifiedTokensOnly } = this.props.context
    const { fixedTokens } = this.props.context.tokens
    const assetResult = this.assetStoreRef.objects('Asset')
      .filtered('name CONTAINS[c] $0', name)
      .filter(({ issuedPercentage, name, startTime, endTime }) =>
        (issuedPercentage < 100 && startTime < Date.now() && endTime > Date.now()) &&
        (verifiedTokensOnly ? fixedTokens.includes(name) : true))
      .map(item => Object.assign({}, item))

    this.setState({searchName: name})

    if (assetResult.length || verifiedTokensOnly) {
      const searchedList = name ? assetResult : []
      this.setState({ currentList: searchedList })
    } else {
      this._searchFromApi(name)
    }
  }

  _searchFromApi = async name => {
    this.setState({searching: true})
    try {
      const assetFromApi = await updateAssets(0, 2, name)
      this.setState({ currentList: assetFromApi })
    } catch (error) {
      logSentry(error, 'Search Participate Error')
    } finally {
      this.setState({searching: false})
    }
  }

  _renderFeaturedTokens = () => {
    const { searchMode, featuredTokens, searching, searchName } = this.state
    console.warn('FeaturedTokens', featuredTokens)

    return null
    const featTokens = featuredTokens.map(token =>
      <React.Fragment key={token.name}>{this._renderCardContent(token)}</React.Fragment>)

    if (searchMode) {
      return <View>
        {
          searching &&
          <View marginBottom={10}>
            <ActivityIndicator color={Colors.primaryText} />
          </View>
        }
        {!searchName && featTokens}
      </View>
    }

    return (
      <View>
        <Row align='center'>
          <HorizontalSpacer size={20} />
          <TronIcon source={require('../../assets/tron-logo-small.png')} />
          <TokensTitle>{tl.t('participate.tokens')}</TokensTitle>
        </Row>
        <VerticalSpacer size={20} />
        <FeaturedCarousel navigation={this.props.navigation} tokens={featuredTokens} />
      </View>
    )
  }

  _renderCardContent = asset => {
    const { name, abbr, price, issuedPercentage, endTime, verified } = asset
    return <Card>
      <TokenLabel label={abbr.substr(0, 3).toUpperCase()} />
      <HorizontalSpacer size={24} />
      <View flex={1} justify='space-between'>
        {verified ? (
          <Row align='center'>
            <FeaturedTokenName>{getCustomName(name)}</FeaturedTokenName>
            <HorizontalSpacer size={4} />
            <Image source={guarantee} style={{ height: 14, width: 14 }} />
          </Row>
        ) : (
          <TokenName>{name}</TokenName>
        )}
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
          onPress={() => { this.props.navigation.navigate('TokenInfo', { item: asset }) }}
          elevation={8}
        >
          <ButtonText>{tl.t('buy').toUpperCase()}</ButtonText>
        </BuyButton>
      </View>
    </Card>
  }

  _renderLoading = () => {
    const { loading } = this.state
    if (loading) {
      return (
        <React.Fragment>
          <ActivityIndicator size='small' color={Colors.primaryText} />
          <VerticalSpacer size={10} />
        </React.Fragment>
      )
    }
    return null
  }

  _renderEmptyAssets = () => {
    const { loading, searchMode, searching, searchName, currentList } = this.state
    if (searchMode && !loading && !!searchName & !searching && !currentList.length) {
      return (
        <View flex={1} align='center' justify='center' padding={20}>
          <Image
            source={require('../../assets/empty.png')}
            resizeMode='contain'
            style={{ width: 200, height: 200 }}
          />
          <Text style={{fontSize: 13}}>{tl.t('participate.error.notFound')}</Text>
        </View>
      )
    }
    return null
  }
  _renderSeparator = () =>
    <View
      height={0.7}
      marginLeft={80}
      marginTop={10}
      width='100%'
      background={Colors.greyBlue}
    />

  render () {
    const { currentList, searchName, featuredTokens } = this.state
    const orderedBalances = orderAssets(currentList)
    const searchPreview = searchName ? `${tl.t('results')} : ${orderedBalances.length}` : tl.t('participate.searchPreview')
    return (
      <Container>
        <NavigationHeader
          title={tl.t('participate.title')}
          onSearch={name => this._onSearching(name)}
          onSearchPressed={() => this._onSearchPressed()}
          searchPreview={searchPreview}
        />
        <FlatList
          ListHeaderComponent={this._renderFeaturedTokens}
          ListFooterComponent={this._renderLoading}
          ListEmptyComponent={this._renderEmptyAssets}
          ItemSeparatorComponent={this._renderSeparator}
          data={currentList}
          extraData={[featuredTokens]}
          renderItem={({ item }) => this._renderCardContent(item)}
          keyExtractor={asset => asset.name}
          scrollEnabled
          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={AMOUNT_TO_FETCH}
          onEndReached={this._loadMore}
          onEndReachedThreshold={0.5}
        />
      </Container>
    )
  }
}

export default withContext(ParticipateHome)
