/* eslint-disable max-len */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import React from 'react';
import { FlatList, ScrollView, RefreshControl } from 'react-native';

import { UserProfile } from 'modules/user/types';
import { UserCharity } from 'modules/charity/types';

import { ScreenWidth } from 'utils/helpers';
import { ResponseErrors } from 'types/responseData';

import { DonationComponent } from 'view/components';
import { Box } from 'view/components/uiKit/Box';
import { Loader } from 'view/components/uiKit/Loader';
import { CharityItem } from './CharityItem';

import {
  Container,
  Header,
  TopHeaderBlock,
  UserNameBlock,
  UserName,
  ProfileViewBlock,
  ProfileViewButton,
  BottomHeaderBlock,
  MainBlock,
  FlatListBlock,
  EditCharitiesBlock,
  EditCharitiesButton,
  ErrorBlock,
  ErrorTitlte,
} from './styled';

interface MyImpactProps {
  user: UserProfile;
  isLoadingUserData: boolean;
  userCharityData: UserCharity;
  isLoadingCharityData: boolean;
  onRefresh: any;
  goToChooseCharity: any;
  goToProfile: any;
  getUserCharityError: ResponseErrors;
  getUserDataError: ResponseErrors;
}

export const MyImpactContainer = ({
  user: { first_name, last_name },
  isLoadingUserData,
  userCharityData,
  isLoadingCharityData,
  onRefresh,
  goToChooseCharity,
  goToProfile,
  getUserCharityError,
  getUserDataError,
}: MyImpactProps) => {
  const renderCharityItem = ({ item }: any) => <CharityItem item={item} />;
  const isShowError =
    Object.values(getUserCharityError).length > 0 || Object.values(getUserDataError).length > 0;

  return (
    <Container>
      {/* header */}
      {isLoadingUserData || isLoadingCharityData ? (
        <Loader />
      ) : (
        <>
          <Header>
            {/* top header */}
            <TopHeaderBlock>
              <UserNameBlock>
                <UserName>{`${first_name} ${last_name && last_name.charAt(0)}.`}</UserName>
              </UserNameBlock>
              <ProfileViewBlock>
                <ProfileViewButton onPress={goToProfile} />
              </ProfileViewBlock>
            </TopHeaderBlock>
            {/* bottom header */}
            <BottomHeaderBlock>
              <DonationComponent
                price={userCharityData.weekly_amount && userCharityData.weekly_amount.toFixed(2)}
                description="this week donations"
                isMargin
              />
              <DonationComponent
                price={
                  userCharityData.all_time_amount && userCharityData.all_time_amount.toFixed(2)
                }
                description="all time donations"
              />
            </BottomHeaderBlock>
          </Header>
          {/* error */}
          {isShowError && (
            <ErrorBlock>
              <ErrorTitlte>
                {`${Object.values(getUserCharityError) ||
                  Object.values(getUserDataError)} Cannot update your data.`}
              </ErrorTitlte>
            </ErrorBlock>
          )}
          {/* main block */}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flex: 1,
              width: ScreenWidth,
            }}
            refreshControl={
              <RefreshControl
                refreshing={isLoadingUserData || isLoadingCharityData}
                onRefresh={onRefresh}
              />
            }
          >
            <MainBlock>
              {/* flatlist */}
              <FlatListBlock>
                <FlatList
                  data={userCharityData.charities}
                  renderItem={renderCharityItem}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => String(index)}
                  bounces={false}
                  ItemSeparatorComponent={() => <Box height={8} />}
                  style={{
                    width: '100%',
                    paddingBottom: 6,
                  }}
                />
              </FlatListBlock>
              {/* button */}
              <EditCharitiesBlock>
                <EditCharitiesButton onPress={goToChooseCharity} />
              </EditCharitiesBlock>
            </MainBlock>
          </ScrollView>
        </>
      )}
    </Container>
  );
};
