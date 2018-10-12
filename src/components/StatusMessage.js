import React from 'react'
import PropTypes from 'prop-types'

import * as Utils from './Utils'
import { Colors } from './DesignSystem'

const StatusMessage = ({systemStatus}) => (
  <Utils.View padding={5} background={systemStatus.statusColor || Colors.background}>
    <Utils.Text size='tiny' font='regular' align='center' color={systemStatus.messageColor || Colors.primaryText}>
      {systemStatus.statusMessage}
    </Utils.Text>
  </Utils.View>
)

StatusMessage.propTypes = {
  systemStatus: PropTypes.shape({
    statusMessage: PropTypes.string.isRequired,
    statusColor: PropTypes.string,
    messageColor: PropTypes.string,
    showStatus: PropTypes.bool
  }).isRequired
}

export default StatusMessage
