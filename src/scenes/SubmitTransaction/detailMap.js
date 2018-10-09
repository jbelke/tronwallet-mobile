import React from 'react'

import tl from '../../utils/i18n'
import { DetailRow, DataRow } from './elements'
import Client, { ONE_TRX } from '../../services/client'

const getDic = (field) => {
  switch (field) {
    case 'contractType':
      return tl.t('submitTransaction.dic.contractType')
    case 'ownerAddress':
      return tl.t('submitTransaction.dic.ownerAddress')
    case 'toAddress':
      return tl.t('submitTransaction.dic.toAddress')
    case 'ParticipateAssetIssueContract':
      return tl.t('submitTransaction.dic.participateAssetIssueContract')
    case 'TransferAssetContract':
      return tl.t('submitTransaction.dic.transferAssetContract')
    case 'TransferContract':
      return tl.t('submitTransaction.dic.transferContract')
    case 'UnfreezeBalanceContract':
      return tl.t('submitTransaction.dic.unfreezeBalanceContract')
    case 'FreezeBalanceContract':
      return tl.t('submitTransaction.dic.freezeBalanceContract')
    case 'AssetIssueContract':
      return tl.t('submitTransaction.dic.assetIssueContract')
    case 'VoteWitnessContract':
      return tl.t('submitTransaction.dic.voteWitnessContract')
    case 'frozenDuration':
      return tl.t('submitTransaction.dic.frozenDuration')
    case 'frozenBalance':
      return tl.t('submitTransaction.dic.frozenBalance')
    default:
      return field
  }
}

const getErrorDic = (errorMessage) => {
  switch (errorMessage) {
    case 'CONTRACT_VALIDATE_ERROR':
      return tl.t('submitTransaction.errorDic.contractValidate')
    case 'SIGERROR':
      return tl.t('submitTransaction.errorDic.signature')
    case 'DUP_TRANSACTION_ERROR':
      return tl.t('submitTransaction.errorDic.duplicate')
    case 'CONTRACT_EXE_ERROR':
      return tl.t('submitTransaction.errorDic.contractValidateCee')
    case 'BANDWITH_ERROR':
      return tl.t('submitTransaction.errorDic.bandwith')
    case 'TAPOS_ERROR':
      return tl.t('submitTransaction.errorDic.contractValidateTapos')
    case 'TOO_BIG_TRANSACTION_ERROR':
      return tl.t('submitTransaction.errorDic.tooBig')
    case 'TRANSACTION_EXPIRATION_ERROR':
      return tl.t('submitTransaction.errorDic.expiration')
    case 'SERVER_BUSY':
      return tl.t('submitTransaction.errorDic.serverBusy')
    case 'AccountResourceInsufficient error':
      return tl.t('submitTransaction.errorDic.resource')
    default:
      return errorMessage
  }
}

export const firstLetterCapitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
const toReadableField = (field) => {
  const translated = getDic(field)
  return isNaN(translated) ? translated.toUpperCase() : translated
}

export const translateError = (errorMessage) => getErrorDic(errorMessage)

const IGNORE_FIELDS = ['hash', 'time']

export default (contracts, tokenAmount) => {
  contracts = {
    ...contracts,
    contractTypeId: contracts.contractType,
    contractType: Client.getContractType(contracts.contractType)
  }
  const contractsRows = []
  for (const ctr in contracts) {
    if (IGNORE_FIELDS.includes(ctr)) continue

    if (ctr === 'contractTypeId') {
      if (Number(contracts[ctr]) === 1) {
        contractsRows.push(<DetailRow
          key={'TOKEN'}
          title={toReadableField('TOKEN')}
          text={toReadableField('TRX')}
        />)
      }
      continue
    }

    if (ctr === 'ownerAddress' || ctr === 'toAddress' ||
      ctr === 'from' || ctr === 'to') {
      contractsRows.push(
        <DetailRow
          key={ctr}
          title={toReadableField(ctr)}
          text={contracts[ctr]}
          address
        />
      )
    } else if (ctr === 'amount' || ctr === 'frozenBalance') {
      const contractId = Number(contracts['contractTypeId'])
      const amountDivider = contractId === 1 || contractId === 11 ? ONE_TRX : 1
      const textToDisplay = contractId === 9 ? tokenAmount : contracts[ctr] / amountDivider
      contractsRows.push(
        <DetailRow
          key={ctr}
          title={toReadableField(ctr)}
          text={textToDisplay}
        />
      )
    } else if (ctr === 'votesList') {
      const totalVotes = contracts[ctr].length
      contractsRows.push(
        <DetailRow key={ctr} title={toReadableField(tl.t('submitTransaction.totalVotes'))} text={totalVotes} />
      )
    } else if (ctr === 'data') {
      contractsRows.push(<DataRow
        key='DATA'
        data={contracts[ctr]}
      />)
    } else {
      contractsRows.push(
        <DetailRow
          key={ctr}
          title={toReadableField(ctr)}
          text={toReadableField(contracts[ctr])}
        />
      )
    }
  }

  return contractsRows
}
