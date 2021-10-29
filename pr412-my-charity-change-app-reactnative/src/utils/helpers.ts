import { Platform, Dimensions } from 'react-native';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import { moderateScale } from 'react-native-size-matters';

export const isIOS = Platform.OS === 'ios';

const Screen = Dimensions.get('window');
export const ScreenWidth = Screen.width;
export const ScreenHeight = isIOS ? Screen.height : ExtraDimensions.getRealWindowHeight();

export const statusBarHeight = isIOS ? getStatusBarHeight() : 0;
export const bottomSpace = isIOS ? getBottomSpace() : 0;

export const defaultScale = (size: number) => moderateScale(size, 0.2);

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const initialValue: any = {};
  return keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), initialValue);
}

export const encodeURIField = ( rawURI: string ) => (
  ( rawURI || '' )
    .replace(/\s/g, '%20')
    .replace(/\//g, '%2F')
);