import RNTron from 'react-native-tron'
import { Linking } from 'react-native'

import tl from '../utils/i18n'
import { TronVaultURL } from './deeplinkUtils'
import getTransactionStore from '../store/transactions'
import Client, { ONE_TRX } from '../services/client'
import { logSentry } from '../utils/sentryUtils'

export const signTransaction = async (privateKey, transactionUnsigned) => {
  try {
    const transactionSigned = await RNTron.signTransaction(
      privateKey,
      transactionUnsigned
    )
    return transactionSigned
  } catch (error) {
    logSentry(error)
  }
}

export const updateTransactions = async (address) => {
  const transactions = await Client.getTransactionList(address)
  const store = await getTransactionStore()
  store.write(() =>
    transactions.map(item => {
      const transaction = createTransaction(item)
      store.create('Transaction', transaction, true)
    })
  )
}

export const updateTransactionByHash = async (hash) => {
  const item = await Client.fetchTransactionByHash(hash)
  const transaction = createTransaction(item)
  const store = await getTransactionStore()

  store.write(() => {
    store.create('Transaction', transaction, true)
  })
}

const createTransaction = (item) => {
  const transaction = {
    id: item.hash,
    type: item.type,
    block: item.block,
    contractData: item.contractData,
    ownerAddress: item.ownerAddress,
    timestamp: item.timestamp,
    confirmed: true
  }
  if (item.type === 'Transfer') {
    transaction.id = item.transactionHash
    transaction.contractData = {
      transferFromAddress: item.transferFromAddress,
      transferToAddress: item.transferToAddress,
      amount: item.amount,
      tokenName: item.tokenName
    }
  }
  if (item.type === 'Create') {
    transaction.contractData = {
      ...transaction.contractData,
      tokenName: item.contractData.name,
      unityValue: item.contractData.trxNum
    }
  }
  if (item.type === 'Participate') {
    transaction.contractData = {
      ...transaction.contractData,
      tokenName: item.contractData.token,
      transferFromAddress: item.contractData.toAddress
    }
  }

  return transaction
}

export const getTranslatedType = (type) => {
  switch (type) {
    case 'Transfer':
      return tl.t('transactionType.transfer')
    case 'Transfer Asset':
      return tl.t('transactionType.transferAsset')
    case 'Freeze':
      return tl.t('transactionType.freeze')
    case 'Unfreeze':
      return tl.t('transactionType.unfreeze')
    case 'Vote':
      return tl.t('transactionType.vote')
    case 'Participate':
      return tl.t('transactionType.participate')
    case 'Create':
      return tl.t('transactionType.create')
    default:
      return tl.t('transactionType.undefined')
  }
}

export const openDeepLink = async dataToSend => {
  const url = `${TronVaultURL}auth/${dataToSend}`
  return Linking.openURL(url)
}

export const getTokenPriceFromStore = (tokenName, assetStore) => {
  const filtered = assetStore
    .objects('Asset')
    .filtered(
      `name == '${tokenName}'`
    )
    .map(item => Object.assign({}, item))

  if (filtered.length) {
    return filtered[0].price
  }

  return ONE_TRX
}
