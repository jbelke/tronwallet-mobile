import React, { Component } from 'react'
import { FlatList, Alert, Image } from 'react-native'

import { Container } from '../Utils'
import ActionModal from '../ActionModal'
import AddressCard from './AddressCard'

import getContactStore from '../../store/contacts'
import { withContext } from '../../store/context'
import tl from '../../utils/i18n'
import { EmptyWrapper, EmptyText } from './elements'
import FontelloIcon from '../FontelloIcon'
import onBackgroundHandler from '../../utils/onBackgroundHandler'

class AddressBook extends Component {
  state = {
    modalVisible: false,
    currentItem: null,
    refreshing: false
  }

  componentDidMount () {
    this.appStateListener = onBackgroundHandler(this._handleAppStateChange)
  }

  componentWillUnmount () {
    this.appStateListener.remove()
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState.match(/background/)) {
      this.setState({ modalVisible: false })
    }
  }
  _onRefresh = () => {
    const { reloadData } = this.props

    this.setState({ refreshing: true })
    reloadData()
    this.setState({ refreshing: false })
  }

  _closeModal = () => {
    this.setState({
      modalVisible: false,
      currentItem: null
    })
  }

  _onCardPress = (item) => {
    this.setState({
      modalVisible: true,
      currentItem: item
    })
  }

  _navigate = (to, itemObj) => {
    const { navigation } = this.props

    this._closeModal()
    navigation.navigate(to, itemObj)
  }

  _onEditPress = () => {
    const { currentItem } = this.state

    this._navigate(
      'EditAddressBookItem',
      {
        item: currentItem,
        isUserAccount: this.props.isUserAccount,
        reloadData: this.props.reloadData
      }
    )
  }

  _onSendPress = () => {
    const { currentItem } = this.state
    this._navigate('SendScene', { address: currentItem.address })
  }

  _onTransactionsPress = () => {
    const { currentItem } = this.state
    this._navigate('TransactionListScene', { contact: currentItem })
  }

  _onDeletePress = () => {
    const { currentItem } = this.state
    const { reloadData, isUserAccount } = this.props

    if (!isUserAccount) {
      Alert.alert(
        tl.t('addressBook.contacts.delete.title'),
        tl.t('addressBook.contacts.delete.message'),
        [
          {
            text: tl.t('addressBook.contacts.delete.cancelButton'),
            onPress: () => {
              this.setState({
                modalVisible: false,
                currentItem: null
              })
            },
            style: 'cancel'
          },
          {
            text: tl.t('addressBook.contacts.delete.okButton'),
            onPress: async () => {
              const store = await getContactStore()
              store.write(() => {
                let item = store.objectForPrimaryKey('Contact', currentItem.address)
                store.delete(item)
              })
              reloadData()
              this.setState({
                modalVisible: false,
                currentItem: null
              })
            }
          }
        ]
      )
    }
  }

  _renderCard = ({ item }) => (
    <AddressCard
      item={item}
      onCardPress={() => { this._onCardPress(item) }}
    />
  )

  _renderEmpty = () => {
    return (
      <EmptyWrapper>
        <Image
          source={require('../../assets/empty-contacts.png')}
          resizeMode='contain'
          style={{ width: 200, height: 200 }}
        />
        <EmptyText>
          {tl.t('addressBook.contacts.empty')}
        </EmptyText>
      </EmptyWrapper>
    )
  }

  _listActions = () => [
    {
      onPress: this._onSendPress,
      text: tl.t('addressBook.shared.send'),
      icon: <FontelloIcon name='send' color='white' size={22} />
    },
    {
      onPress: this._onTransactionsPress,
      text: tl.t('txs').toUpperCase(),
      icon: <FontelloIcon name='transfer' color='white' size={22} />
    },
    {
      onPress: this._onEditPress,
      text: tl.t('addressBook.shared.edit'),
      icon: <FontelloIcon name='edit' color='white' size={22} />
    },
    this.props.isUserAccount ? null
      : {
        onPress: this._onDeletePress,
        text: tl.t('addressBook.shared.delete'),
        icon: <FontelloIcon name='delete' color='white' size={22} />
      }
  ].filter(action => action)

  render () {
    const { modalVisible, refreshing } = this.state
    const { items, children } = this.props

    return (
      <Container style={{position: 'relative'}}>
        <ActionModal
          visible={modalVisible}
          closeModal={this._closeModal}
          animationType='fade'
          actions={this._listActions()}
        />
        <FlatList
          keyExtractor={item => item.address}
          data={items}
          refreshing={refreshing}
          onRefresh={this._onRefresh}
          renderItem={this._renderCard}
          ListEmptyComponent={this._renderEmpty}
        />
        {children}
      </Container>
    )
  }
}

export default withContext(AddressBook)
