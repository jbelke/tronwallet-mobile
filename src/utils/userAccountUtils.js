import { AsyncStorage } from 'react-native'

import getBalanceStore from '../store/balance'
import getTransactionStore from '../store/transactions'
import getCandidatesStore from '../store/candidates'
import { USER_STATUS, USER_FILTERED_TOKENS, VERIFIED_TOKENS } from './constants'

import NodesIp from '../utils/nodeIp'
import { resetContactsData } from '../utils/contactUtils'
import { resetSecretData } from '../utils/secretsUtils'

export const resetWalletData = async () => {
  const [balanceStore, transactionStore] = await Promise.all([
    getBalanceStore(),
    getTransactionStore()
  ])
  const allBalances = balanceStore.objects('Balance')
  const allTransactions = transactionStore.objects('Transaction')
  await Promise.all([
    balanceStore.write(() => balanceStore.delete(allBalances)),
    transactionStore.write(() => transactionStore.delete(allTransactions))
  ])
}

export const buildFeaturedFilterString = (comparison = '==', logic = 'OR') =>
  VERIFIED_TOKENS.reduce((filter, token, index) => {
    filter += `name ${comparison} '${token}'`
    if (index + 1 < VERIFIED_TOKENS.length) {
      filter += ` ${logic} `
    }
    return filter
  }, '')

// This is used for testnet mainly
export const resetListsData = async () => {
  const candidatesStore = await getCandidatesStore()
  const candidateList = candidatesStore.objects('Candidate')
  await candidatesStore.write(() => candidatesStore.delete(candidateList))
}

export const hardResetWalletData = async (pin) => (
  Promise.all([
    resetWalletData(),
    resetListsData(),
    resetContactsData(),
    resetSecretData(pin),
    NodesIp.switchTestnet(false),
    AsyncStorage.setItem(USER_STATUS, 'reset'),
    AsyncStorage.setItem(USER_FILTERED_TOKENS, '[]')
  ])
)
