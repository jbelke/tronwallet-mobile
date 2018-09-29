import styled, { css } from 'styled-components'
import { Colors } from '../DesignSystem'

export const ContactsModalWrapper = styled.TouchableHighlight`
  flex: 1;
  padding: 20px;
  background-color: rgba(0,0,0,0.5);
`
export const ContactsModalCard = styled.View`
  top: 150px;
  border-radius: 5px;
  background-color: ${Colors.dusk};
  padding-horizontal: 15px;
`
export const Divider = styled.View`
  height: 1px;
  background-color: ${Colors.background};
`

export const ActionRow = styled.View`
  flex-direction: row;
  padding-horizontal: 10px;
  padding-vertical: 40px;
`
const Text = css`
  font-size: 12px;
  text-align: center;
`
export const Title = styled.Text`
  ${Text}
  font-family: Rubik-Medium;
  line-height: 16px;
  letter-spacing: 0;
  color: ${Colors.greyBlue};
  margin-top: 25px;
`
export const Action = styled.TouchableOpacity`
  padding: 35px;
`
export const ActionText = styled.Text`
  ${Text}
  font-family: Rubik-Bold;
  line-height: 12px;
  letter-spacing: 0.6px;
  color: white;
`
