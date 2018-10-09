import React from 'react'
import PropTypes from 'prop-types'

import ButtonIconGradient from '../../components/ButtonIconGradient'
import Modal from '../Modal'
import {
  ContactsModalWrapper,
  ContactsModalCard,
  Title,
  ActionRow
} from './elements'

import tl from '../../utils/i18n'
import { Colors } from '../DesignSystem'

const AddressBookModal = ({
  visible,
  closeModal,
  animationType,
  actions
}) => (<Modal
  modalOpened={visible}
  closeModal={closeModal}
  animationType={animationType}
  transparent
>
  <ContactsModalWrapper onPress={closeModal}>
    <ContactsModalCard>
      <Title>{tl.t('actionModalTitle')}</Title>
      <ActionRow>
        {actions && actions.map(action => action &&
          <ButtonIconGradient
            size={58}
            key={action.text}
            text={action.text}
            background={Colors.dusk}
            color={Colors.greyBlue}
            icon={action.icon}
            onPress={action.onPress}
            textSpacing='small'
            textSize={9}
            full
          />
        )}
      </ActionRow>
    </ContactsModalCard>
  </ContactsModalWrapper>
</Modal>
)
AddressBookModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  animationType: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.shape({
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired
  })).isRequired
}

export default AddressBookModal
