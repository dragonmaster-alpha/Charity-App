import { TextInput } from 'react-native';
import styled from 'styled-components';
import { moderateScale } from 'react-native-size-matters';

export const Container = styled.View`
  flex-direction: row;
  background-color: ${({ theme }: any ) => theme.colors.background};
  border-radius: 20px;
  height: ${moderateScale(38, 0.2)};
  align-items: center;
  width: 100%;
`;

export const StyledInput = styled(TextInput).attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.info,
}))`
  padding: 0;
  padding-left: ${moderateScale(40, 0.2)};
  padding-right: ${moderateScale(40, 0.2)};
  flex: 1;
  font-size: ${moderateScale(14, 0.2)};
  line-height: ${moderateScale(18, 0.2)};
  font-family: ${({ theme }) => theme.defaultFontFamily};
  color: ${({ theme }) => theme.colors.mainText};
`;

export const SearchIcon = styled.Image.attrs({
  source: require('assets/img/searchIcon.png'),
})`
  position: absolute;
  top: ${moderateScale(10, 0.2)};
  left: ${moderateScale(15, 0.2)};
  width: ${moderateScale(18, 0.2)};
  height: ${moderateScale(18, 0.2)};
  z-index: 1;
  tint-color: ${({ isSelected, theme }: { isSelected: boolean, theme: any }) =>
    isSelected ? theme.colors.mainText : theme.colors.info};
`;
