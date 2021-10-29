/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useState, useEffect } from 'react';
import { FlatList, ScrollView, RefreshControl, Alert } from 'react-native';
import { useSelector } from 'react-redux';

import { RootState } from 'types';
import { useAction } from 'utils/hooks';
import { ScreenWidth } from 'utils/helpers';

import { getUserFeed, sendReceipt, resetCharityReducer } from 'modules/charity/actions';

import { ProgressBar } from 'view/components/uiKit/ProgressBar';
import { Loader } from 'view/components/uiKit/Loader';
import { Box } from 'view/components/uiKit/Box';
import { FeedItem } from './FeedItem';

import {
  Container,
  Header,
  TopHeaderBlock,
  TitleBlock,
  Title,
  ProgressBarBlock,
  DonateBlock,
  DonateInfo,
  BottomHeaderBlock,
  CardBlock,
  CardPlaceholder,
  CardInfo,
  CardEndInfo,
  EditIconBlock,
  EditIcon,
  MainBlock,
  ShowHideFeedButton,
  FlatListBlock,
  ErrorBlock,
  ErrorTitlte,
} from './styled';

export const PersonalDetails = ({ editCard, onRefresh }: any) => {
  const [isShowFeed, setShowFeed] = useState(false);

  const getUserFeedData = useAction(getUserFeed);
  const sendUserReceipt = useAction(sendReceipt);
  const resetReducer = useAction(resetCharityReducer);

  const {
    user: { weekly_amount, weekly_goal, card },
    isLoadingUserData,
    getUserDataError,
  } = useSelector((state: RootState) => state.userReducer);
  const {
    userFeedData,
    next_page,
    getUserFeedError,
    isLoadingSendReceipt,
    alertMessage,
  } = useSelector((state: RootState) => state.charityReducer);

  const showFeed = isShowFeed ? 'Hide feed' : 'Show feed';
  const progressData = (weekly_amount * 100) / weekly_goal;

  useEffect(() => {
    if (alertMessage.length > 0) {
      Alert.alert(
        alertMessage,
        '',
        [
          {
            text: 'OK',
            onPress: () => resetReducer(),
          },
        ],
        { cancelable: false },
      );
    }
  }, [alertMessage]);

  const renderFeedListItem = ({ item }: any) => <FeedItem item={item} />;

  const loadMoreItems = () => {
    if (next_page) {
      getUserFeedData(true);
    }
  };

  const isShowError =
    Object.values(getUserFeedError).length > 0 || Object.values(getUserDataError).length > 0;

  return (
    <Container>
      {/* header */}
      {isLoadingUserData ? (
        <Loader />
      ) : (
        <>
          <Header>
            {/* top header */}
            <TopHeaderBlock>
              <TitleBlock>
                <Title>Weekly goal</Title>
                <DonateInfo
                  style={{ lineHeight: 27 }}
                >{`Donate $${weekly_amount} of $${weekly_goal}`}</DonateInfo>
              </TitleBlock>
              <ProgressBarBlock>
                {/* progressbar */}
                <ProgressBar progressValue={`${progressData}%`} />
              </ProgressBarBlock>
              <DonateBlock>
                <DonateInfo>Donations may be tax deductible</DonateInfo>
              </DonateBlock>
            </TopHeaderBlock>
            {/* bottom header */}
            <BottomHeaderBlock onPress={editCard}>
              <CardBlock>
                <CardPlaceholder />
                <CardInfo>Card ending </CardInfo>
                <CardEndInfo>{card.card_ending}</CardEndInfo>
              </CardBlock>
              <EditIconBlock>
                <EditIcon />
              </EditIconBlock>
            </BottomHeaderBlock>
          </Header>
          {/* error */}
          {isShowError && (
            <ErrorBlock>
              <ErrorTitlte>
                {`${Object.values(getUserFeedError) ||
                  Object.values(getUserFeedError)} Cannot update your data.`}
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
            refreshControl={<RefreshControl refreshing={isLoadingUserData} onRefresh={onRefresh} />}
          >
            <MainBlock>
              <Box mb="10px">
                <ShowHideFeedButton
                  label="Email receipts"
                  bg="#1D65BC"
                  color="#fff"
                  onPress={sendUserReceipt}
                  loading={isLoadingSendReceipt}
                  reverseLoader
                />
              </Box>
              {/* show/hide button */}
              <ShowHideFeedButton
                label={showFeed}
                bg={isShowFeed ? '#E4EDF7' : '#1D65BC'}
                color={isShowFeed && '#1D65BC'}
                onPress={() => setShowFeed(!isShowFeed)}
              />
              {/* flatlist */}
              {isShowFeed && (
                <FlatListBlock>
                  <FlatList
                    data={userFeedData}
                    renderItem={renderFeedListItem}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => String(index)}
                    onEndReachedThreshold={0.1}
                    onEndReached={loadMoreItems}
                    style={{
                      width: '100%',
                    }}
                  />
                </FlatListBlock>
              )}
            </MainBlock>
          </ScrollView>
        </>
      )}
    </Container>
  );
};
