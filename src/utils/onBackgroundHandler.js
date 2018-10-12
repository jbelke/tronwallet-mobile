
import { Platform, AppState, DeviceEventEmitter } from 'react-native'

export default (callbackHandler) => {
  if (Platform.OS === 'android') {
    return DeviceEventEmitter.addListener('ActivityStateChange', (e) => callbackHandler(e.event))
  } else {
    AppState.addEventListener('change', callbackHandler)
    callbackHandler.remove = () => AppState.removeEventListener('change', callbackHandler)
    return callbackHandler
  }
}
