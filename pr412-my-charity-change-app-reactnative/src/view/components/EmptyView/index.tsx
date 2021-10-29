import React from 'react';
import { View, Image } from 'react-native';

import { Text } from 'view/components/uiKit/Text';

interface Props {
  title?: string;
}

export const EmptyView: React.FC<Props> = ({ title }) => (
  <View
    style={{
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Image
      source={require('assets/img/logo.png')}
      style={{ width: 127.5, height: 114, marginBottom: 20.7 }}
      resizeMode="contain"
    />
    <Text color="#131414" size={21}>
      {title || 'No search results.'}
    </Text>
  </View>
);
