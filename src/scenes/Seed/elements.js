import styled from 'styled-components'
import { Colors } from '../../components/DesignSystem'

// Create
export const MainCard = styled.View`
  border-radius: 5px;
  backgroundColor: ${Colors.lighterBackground};
  padding: 12px;
`
export const SeedMessage = styled.View`
  align-items: center;
  justify-content: center;
  paddingHorizontal:32px;
  paddingVertical: 10px;
`
export const SeedInfo = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  paddingHorizontal: 38px;
`
export const ButtonRow = styled.View`
  flex-direction: row;
  align-items: center;
  height: 60px;
  justify-content: center;
  paddingHorizontal: 5px;
`
