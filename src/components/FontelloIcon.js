import React from 'react'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import fontelloConfig from '../assets/icons/config.json'

const Icon = createIconSetFromFontello(fontelloConfig, 'tronwallet')

export default props => <Icon {...props} />
