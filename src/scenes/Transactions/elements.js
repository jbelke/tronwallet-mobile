import styled, { css } from 'styled-components'
import { Colors } from '../../components/DesignSystem'

const Row = css`
  flex-direction: row;
`
export const Card = styled.TouchableOpacity`
  border-left-width: 3px;
  border-color: ${props => props.confirmed ? '#3fe77b' : '#ff4465'}
  padding-horizontal: 24px;
  padding-vertical: 18px;
  margin-bottom: 2px;
`
export const InfoRow = styled.View`
  ${Row}
  justify-content: space-between;
  align-items: center;
`
export const VSpacer = styled.View`
  height: 10px;
`
export const HSpacer = styled.View`
  width: 10px;
`
export const Background = styled.View`
  background-color: ${Colors.background};
  flex: 1;
`

/* Top Row */
const BadgeFont = css`
  font-family: Rubik-Medium;
  font-size: 11px;
  line-height: 11px;
  color: white;
`
export const Badge = styled.View`
  height: 24px;
  padding-horizontal: 10px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color};
`
export const BadgeText = styled.Text`
  top: 1;
  ${BadgeFont}
  letter-spacing: 0.6px;
`
export const TransactionValue = styled.View`
  ${Row}
  justify-content: flex-end;
  align-items: center;
`
export const InfoAmount = styled.Text`
  font-family: Rubik-Medium;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.8px;
  color: white;
`

/* Middle Row */
export const Confirmation = styled.Text`
  ${BadgeFont}
  letter-spacing: 0;
`
export const Moment = styled.Text`
  font-family: Rubik-Regular;
  font-size: 10px;
  letter-spacing: 0;
  top: -4px;
  color: rgb(156, 158, 185);
`

/* Address Row */
const AdressFont = css`
  font-size: 10px;
  line-height: 16px;
  color: white;
`
export const AddressRow = styled.View`
  ${Row}
`
export const AddressTitle = styled.Text`
  font-family: Rubik-Medium;
  ${AdressFont}
`
export const Address = styled.Text`
  font-family: Rubik-Regular;
  ${AdressFont}
`

/* Empty */
export const EmptyScreenContainer = styled.View`
  background-color: ${Colors.background};
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: 50px;
`
export const EmptyScreenText = styled.Text`
  font-family: Rubik-Medium;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0;
  color: white;
`

/* Filter */
export const FilterWrapper = styled.View`
  height: 60px;
  margin-bottom: 20px;
  margin-horizontal: 20px;
  background-color: ${Colors.darkThree};
  border-radius: 5px;
  flex-direction: row;
  padding-horizontal: 20px;
  padding-vertical: 20px;
  justify-content: space-between;
  shadow-offset: 0 5px;
  shadow-radius: 10px;
  shadow-color: #000;
`
export const FilterText = styled.Text`
  font-family: Rubik-${props => props.regular ? 'Regular' : 'Medium'};
  font-size: 14px;
  line-height: 16px;
  color: ${props => props.dark ? Colors.secondaryText : Colors.greyBlue};
  margin-horizontal: ${props => props.marginX ? props.marginX : 0}px;
`
export const InnerRow = styled.View`
  align-items:center;
  flex-direction: row;
  margin:0px;
  padding:0px;
  max-width:60%;
`
