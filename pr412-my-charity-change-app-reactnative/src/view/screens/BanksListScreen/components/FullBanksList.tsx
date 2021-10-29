/* eslint-disable no-console */
import React from 'react';
import { useSelector } from 'react-redux';
import { FlatList, TouchableOpacity } from 'react-native';

import { Navigation, RootState } from 'types';

import { EmptyView } from 'view/components/EmptyView';

import {
  FlatListBlock,
  ContainerList,
  RightBlock,
  LogoBlock,
  StyledImage,
  CharityNameBlock,
  CharityName,
} from '../styled';

interface Props {
  navigation: Navigation;
}

export const FullBanksList: React.FC<Props> = React.memo(({ navigation }) => {
  const { banksList } = useSelector((state: RootState) => state.bankReducer);

  const renderBanksList = ({ item }) => {
    return (
      <ContainerList
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 4,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate('CreateBankAccount', item)}>
          <RightBlock>
            <LogoBlock>
              {item.logo && (
                <StyledImage
                  source={{ uri: item.logo }}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </LogoBlock>
            <CharityNameBlock>
              <CharityName>{item.name}</CharityName>
            </CharityNameBlock>
          </RightBlock>
        </TouchableOpacity>
      </ContainerList>
    );
  };
  return (
    <FlatListBlock>
      {banksList.length > 0 ? (
        <FlatList
          key={1}
          data={banksList}
          renderItem={renderBanksList}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => String(index)}
          numColumns={1}
          style={{
            width: '100%',
          }}
        />
      ) : (
        <EmptyView />
      )}
    </FlatListBlock>
  );
});
