import styled from 'styled-components';
import { moderateScale } from 'react-native-size-matters';

import { Box } from 'view/components/uiKit/Box';
import { Text } from 'view/components/uiKit/Text';
import { Button } from 'view/components/uiKit/Button';

// personal details screen
export const Container = styled(Box).attrs(({ theme }) => ({
  flex: 1,
  bg: theme.colors.mainText,
}))``;

//  header
export const Header = styled(Box).attrs(({ theme }) => ({
  bg: theme.colors.main,
  p: `${moderateScale(16, 0.5)}px`,
}))``;

export const TopHeaderBlock = styled(Box).attrs({
  align: 'center',
  pb: `${moderateScale(22, 0.5)}px`,
})``;

export const TitleBlock = styled(Box).attrs({
  mb: `${moderateScale(18, 0.5)}px`,
  row: true,
  align: 'flex-end',
  spaceBetween: true,
})``;

export const Title = styled(Text).attrs({
  size: 28,
  weight: 'bold',
  numberOfLines: 1,
  ellipsizeMode: 'tail',
})``;

export const ProgressBarBlock = styled(Box).attrs({
  mb: `${moderateScale(12, 0.5)}px`,
})``;

export const DonateBlock = styled(Box).attrs({
  row: true,
  spaceBetween: true,
})``;

export const DonateInfo = styled(Text).attrs(({ theme }) => ({
  size: 14,
  color: theme.colors.progressValue,
}))``;

export const BottomHeaderBlock = styled.TouchableOpacity`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 4;
  padding: ${moderateScale(16, 0.5)}px;
`;

export const CardBlock = styled(Box).attrs({
  row: true,
  width: 'auto',
  flex: 3,
  align: 'center',
})``;

export const CardPlaceholder = styled.Image.attrs({
  source: require('assets/img/cardPlaceholder.png'),
})`
  width: 16;
  height: 13;
  margin-right: 14;
`;

export const CardInfo = styled(Text).attrs(({ theme }) => ({
  size: 14,
  color: theme.colors.info,
}))``;

export const CardEndInfo = styled(Text).attrs({
  size: 14,
})``;

export const EditIconBlock = styled(Box).attrs({
  width: 'auto',
  flex: 1,
  align: 'flex-end',
})``;

export const EditIcon = styled.Image.attrs({
  source: require('assets/img/editIcon.png'),
})`
  width: 13;
  height: 13;
`;

// mainBlock
export const MainBlock = styled(Box).attrs({
  p: `${moderateScale(14, 0.5)}px`,
  flex: 1,
  mb: `${moderateScale(24, 0.5)}px`,
})``;

export const ShowHideFeedButton = styled(Button).attrs({
  size: '12',
  height: '36',
  width: '100%',
  weight: 'bold',
})``;

export const FlatListBlock = styled(Box).attrs({
  pt: `${moderateScale(16, 0.5)}px`,
  pb: `${moderateScale(16, 0.5)}px`,
  mb: 42,
})``;

export const ErrorBlock = styled(Box).attrs(({ theme }) => ({
  bg: theme.colors.errorBackground,
  br: 4,
  center: true,
  align: 'center',
  p: '9px',
}))``;

export const ErrorTitlte = styled(Text).attrs(({ theme }) => ({
  color: theme.colors.error,
  center: true,
}))``;
