import React, { Component } from 'react'

import { withContext } from '../../store/context'
import tl from '../../utils/i18n'
import AddressBook from '../../components/AddressBook'

class Contacts extends Component {
  static navigationOptions = () => ({ title: tl.t('settings.accounts.title').toUpperCase() })
  render () {
    const { navigation } = this.props

    return (
      <AddressBook
        items={this.props.context.accounts}
        navigation={navigation}
        reloadData={this.props.context.loadUserData}
        isUserAccount
      />
    )
  }
}

export default withContext(Contacts)
