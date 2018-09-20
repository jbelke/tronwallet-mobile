import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native'
import { withNavigation } from 'react-navigation'
import LottieView from 'lottie-react-native'
import Feather from 'react-native-vector-icons/Feather'
import Modal from 'react-native-modal'

// Design
import { Colors } from '../../components/DesignSystem'
import Badge from '../../components/Badge'
import * as Utils from '../../components/Utils'

// Utils
import tl from '../../utils/i18n'
import { formatNumber } from '../../utils/numberUtils'
import { orderBalances } from '../../utils/balanceUtils'
import { getCustomName, updateAssets } from '../../utils/assetsUtils'
import getAssetsStore from '../../store/assets'
import { USER_FILTERED_TOKENS } from '../../utils/constants'
import { logSentry } from '../../utils/sentryUtils'

class WalletBalances extends Component {
  state = {
    currentUserTokens: null,
    modalTokenVisible: false,
    errorToken: null
  }

  async componentDidUpdate (prevProps) {
    try {
      const { currentUserTokens } = this.state
      const filteredTokens = await AsyncStorage.getItem(USER_FILTERED_TOKENS)
      if (currentUserTokens !== filteredTokens) this.setState({ currentUserTokens: filteredTokens })
    } catch (e) {
      logSentry(e, 'WalletBalances - Update Data')
    }
  }

  _navigateToToken = async ({ name: tokenName }) => {
    try {
      const assetStore = await getAssetsStore()
      const assetData = assetStore
        .objects('Asset')
        .filtered('name = $0', tokenName)[0]

      if (assetData) {
        this.props.navigation.navigate('TokenDetailScene', { item: assetData })
      } else {
        this.setState({modalTokenVisible: true, errorToken: null}, () => this._fetchAndNavigate(tokenName))
      }
    } catch (error) {
      logSentry(error, 'Navigate to Token Info')
      this.setState({modalTokenVisible: false})
    }
  }

  _fetchAndNavigate = async (tokenName) => {
    try {
      let newAssetData = await updateAssets(0, 2, tokenName)
      newAssetData = newAssetData.find(asset => asset.name === tokenName)
      if (newAssetData && this.state.modalTokenVisible) {
        this.setState({modalTokenVisible: false, errorToken: null})
        this.props.navigation.navigate('TokenDetailScene', { item: newAssetData })
      } else {
        this.setState({errorToken: tl.t('balanceToken.notAvailable')})
      }
    } catch (error) {
      logSentry(error, 'Error fetching Token Data')
      this.setState({errorToken: tl.t('balanceToken.notAvailable')})
    }
  }

  _getOrderedBalances = () => {
    const { currentUserTokens } = this.state
    const { balances } = this.props
    if (currentUserTokens) {
      const parsedTokens = JSON.parse(currentUserTokens)
      const filteredBalances = balances.filter(asset => parsedTokens.findIndex(name => name === asset.name) === -1)
      return orderBalances(filteredBalances)
    }
    if (balances.length) {
      return orderBalances(balances)
    }
    return []
  }

  render () {
    const balancesToDisplay = this._getOrderedBalances()
    if (balancesToDisplay.length) {
      return (
        <React.Fragment>
          <Utils.VerticalSpacer size='large' />
          <Utils.Row justify='space-between'>
            <Utils.Text size='xsmall' secondary>
              {tl.t('balance.tokens')}
            </Utils.Text>
            <Utils.Text size='xsmall' secondary>
              {tl.t('balance.holdings')}
            </Utils.Text>
          </Utils.Row>
          <Utils.VerticalSpacer size='big' />
          {balancesToDisplay && balancesToDisplay.map((item) => (
            <Utils.Content key={item.name} paddingHorizontal='none' paddingVertical='medium'>
              <TouchableOpacity
                disabled={item.name === 'TRX'}
                onPress={() => this._navigateToToken(item)}>
                <Utils.Row justify='space-between'>
                  <Badge bg={Colors.lightestBackground} guarantee={item.verified}>{getCustomName(item.name)}</Badge>
                  <Utils.Text>{formatNumber(item.balance)}</Utils.Text>
                </Utils.Row>
              </TouchableOpacity>
            </Utils.Content>
          ))}
          <Modal
            isVisible={this.state.modalTokenVisible}
            animationIn='fadeInDown'
            animationOut='fadeOutUp'>
            <Utils.View
              flex={1}
              align='center'
              justify='center'>
              <Utils.View
                align='center'
                justify='center'
                style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.closeModal}
                  onPress={() => this.setState({modalTokenVisible: false})}>
                  <Feather name='x' color='white' size={16} />
                </TouchableOpacity>
                {
                  this.state.modalTokenVisible &&
                  <LottieView
                    source={require('../../assets/animations/searchToken.json')}
                    autoPlay
                    loop={!!this.state.errorToken}
                    style={{ width: 50, height: 50 }}
                  />
                }
                <Utils.VerticalSpacer />
                <Utils.Text size='tiny' font='regular'>
                  {this.state.errorToken || tl.t('balanceToken.updating')}
                </Utils.Text>
              </Utils.View>
            </Utils.View>
          </Modal>
        </React.Fragment>
      )
    }

    return null
  }
}

WalletBalances.propTypes = {
  balances: PropTypes.array
}

WalletBalances.defaultProps = {
  balances: []
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 15,
    borderColor: Colors.primaryText,
    borderRadius: 5,
    maxWidth: 200,
    minWidth: 120,
    backgroundColor: Colors.background
  },
  closeModal: {
    position: 'absolute',
    right: 10,
    top: 10
  }
})

export default withNavigation(WalletBalances)
