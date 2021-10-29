import React from 'react';
import moment from 'moment';

import { Image } from 'react-native';
import { Box } from 'view/components/uiKit/Box';

import {
  DayBlock,
  HorizontalView,
  DayNameBlock,
  DayName,
  FeedInfoBlock,
  NamePriceBlock,
  FeedIconBlock,
  FeedName,
  FeedPrice,
  FeedAdded,
} from './styled';

interface FeedItemProps {
  item: any;
}

export const FeedItem = ({ item }: FeedItemProps) => {
  const convertDate = moment(Object.keys(item).toString()).calendar();
  const getMonthDate = moment(Object.keys(item).toString()).format('ll');
  const dayTitle =
    convertDate.indexOf('Last') > -1
      ? getMonthDate.substr(0, getMonthDate.indexOf(','))
      : convertDate.substr(0, convertDate.indexOf(' '));
  return (
    <>
      <DayBlock>
        <HorizontalView />
        <DayNameBlock>
          <DayName>{dayTitle || getMonthDate.substr(0, getMonthDate.indexOf(','))}</DayName>
        </DayNameBlock>
      </DayBlock>
      {item[Object.keys(item).toString()].map(
        (feed: { description: string; amount: number; donat_amount: number }) => (
          <FeedInfoBlock>
            <NamePriceBlock flex={3}>
              <FeedIconBlock>
                <Image
                  source={require('assets/img/feedIcon.png')}
                  style={{ width: 18, height: 13 }}
                />
              </FeedIconBlock>
              <Box width="82%">
                <FeedName>{feed.description}</FeedName>
                <FeedPrice>${feed.amount}</FeedPrice>
              </Box>
            </NamePriceBlock>
            <Box flex={1} align="flex-end">
              <FeedAdded>+ ${feed.donat_amount}</FeedAdded>
            </Box>
          </FeedInfoBlock>
        ),
      )}
    </>
  );
};
