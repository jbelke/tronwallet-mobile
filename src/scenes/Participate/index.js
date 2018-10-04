import React from 'react'
import { Answers } from 'react-native-fabric'
import {Image, FlatList, ActivityIndicator, Platform, RefreshControl} from 'react-native'
import ProgressBar from 'react-native-progress/Bar'
import moment from 'moment'
import debounce from 'lodash/debounce'
import union from 'lodash/union'
import clamp from 'lodash/clamp'
import sampleSize from 'lodash/sampleSize'

import tl from '../../utils/i18n'
import { Colors } from '../../components/DesignSystem'
import { getCustomName } from '../../utils/assetsUtils'
import { ONE_TRX } from '../../services/client'
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
  TokenLabel
} from './Elements'

import TokenCarousel from './TokenCarousel'
import { BATCH_NUMBER, getTokens, queryToken } from '../../services/contentful'
import LoadingScene from '../../components/LoadingScene'
import FontelloIcon from '../../components/FontelloIcon'

class ParticipateHome extends React.Component {
  static navigationOptions = () => {
    return { header: null }
  }

  state = {
    assetList: [],
    currentList: [],
    featuredTokens: [],
    start: 0,
    loading: true,
    refreshing: false,
    loadingMore: false,
    searchMode: false,
    searchName: '',
    totalTokens: 0,
    error: null
  }

  async componentDidMount () {
    Answers.logContentView('Tab', 'Participate')
    this._onSearching = debounce(this._onSearching, 250)
    this._navListener = this.props.navigation.addListener('didFocus', this._loadData)
  }

  _loadData = async () => {
    this.setState({ start: 0 })
    const { verifiedTokensOnly } = this.props.context
    try {
      const {assets, featured, totalTokens, allAssets} = await getTokens(verifiedTokensOnly)
      const randomSample = sampleSize(allAssets, 4)
      this.setState({totalTokens, assetList: allAssets, featuredTokens: randomSample, currentList: allAssets})
    } catch (error) {
      logSentry(error, 'Initial load participate')
      this.setState({ error: error.message })
    } finally {
      this.setState({ loading: false })
    }
  }

  _loadMore = async () => {
    const { start, assetList, searchMode, loading, totalTokens } = this.state
    const { verifiedTokensOnly } = this.props.context
    const newStart = clamp(start + BATCH_NUMBER, totalTokens)

    if (loading || searchMode || newStart === totalTokens) return

    this.setState({ loadingMore: true })
    try {
      const {assets} = await getTokens(verifiedTokensOnly, newStart)
      const updatedAssets = union(assetList, assets)

      this.setState({ start: newStart, assetList: updatedAssets, currentList: updatedAssets })
    } catch (error) {
      this.setState({ error: error.message })
      logSentry(error, 'Participate - Load more candidates')
    } finally {
      this.setState({ loadingMore: false })
    }
  }

  _refreshData = async () => {
    this.setState({refreshing: true, error: null})
    await this._loadData()
    this.setState({refreshing: false, error: null})
  }

  _filterOrderedAssets = assets => assets
    .filter(({ issuedPercentage, name, startTime, endTime }) =>
      issuedPercentage < 100 && startTime < Date.now() &&
    endTime > Date.now())

  _onSearchPressed = () => {
    const { searchMode, assetList } = this.state
    this.setState({ searchMode: !searchMode, searchName: '' })

    if (searchMode) {
      this.setState({ currentList: assetList })
    } else {
      this.setState({ currentList: [] })
    }
  }

  _onSearching = async name => {
    const { assetList, featuredTokens } = this.state

    const regex = new RegExp(name.toUpperCase(), 'i')
    const resultList = [...featuredTokens, ...assetList].filter(ast => regex.test(ast.name.toUpperCase()))

    this.setState({searchName: name})
    if (resultList.length) {
      const searchedList = name ? resultList : []
      this.setState({ currentList: searchedList })
    } else {
      this._searchFromApi(name)
    }
  }

  _searchFromApi = async name => {
    const { verifiedTokensOnly } = this.props.context
    this.setState({searching: true})
    try {
      const { results } = await queryToken(verifiedTokensOnly, name)
      this.setState({ currentList: results })
    } catch (error) {
      logSentry(error, 'Search Participate Error')
    } finally {
      this.setState({searching: false})
    }
  }

  _renderFeaturedTokens = () => {
    const { searchMode, featuredTokens, searching, searchName } = this.state
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
        <TokenCarousel navigation={this.props.navigation} tokens={featuredTokens} />
      </View>
    )
  }

  _renderCardContent = asset => {
    const { name, abbr, price, issuedPercentage, endTime, isVerified, isFeatured } = asset
    return <Card>
      <TokenLabel label={abbr.substr(0, 3).toUpperCase()} />
      <HorizontalSpacer size={24} />
      <View flex={1} justify='space-between'>
        {isVerified ? (
          <Row align='center'>
            <FeaturedTokenName>{getCustomName(name)}</FeaturedTokenName>
            <HorizontalSpacer size={4} />
            {isFeatured &&
            <React.Fragment>
              <FontelloIcon
                name='guarantee'
                style={{ height: 14, width: 14 }}
                color={Colors.primaryGradient[0]}
              />
              <HorizontalSpacer size={2} />
            </React.Fragment>}
            <FontelloIcon
              name='guarantee'
              style={{ height: 14, width: 14 }}
              color='#3face7'
            />
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
    const { loadingMore } = this.state
    if (loadingMore) {
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
    const { loading, searchMode, searching, searchName, currentList, error } = this.state

    if (loading) return <LoadingScene />

    if ((searchMode && !loading && !!searchName & !searching && !currentList.length) || error) {
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
      height={0.5}
      marginLeft={80}
      marginTop={10}
      width='100%'
      background={Colors.greyBlue}
    />

  render () {
    const { refreshing, currentList, searchName, featuredTokens } = this.state
    const searchPreview = searchName ? `${tl.t('results')} : ${currentList.length}` : tl.t('participate.searchPreview')
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
          refreshControl={<RefreshControl
            refreshing={refreshing}
            onRefresh={this._refreshData}
          />}
          data={currentList}
          extraData={[featuredTokens]}
          renderItem={({ item }) => this._renderCardContent(item)}
          keyExtractor={asset => asset.name}
          scrollEnabled
          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={BATCH_NUMBER}
          onEndReached={this._loadMore}
          onEndReachedThreshold={0.5}
        />
      </Container>
    )
  }
}

export default withContext(ParticipateHome)
