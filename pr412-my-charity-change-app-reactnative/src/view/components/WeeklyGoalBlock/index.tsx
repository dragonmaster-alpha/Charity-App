import React from 'react';

import { Slider } from 'view/components/uiKit/Slider';

import {
  WeeklyGoalBlock,
  WeeklyTitle,
  WeeklyValueWrapper,
  WeeklyValue,
  SliderBlock,
  WeeklyIntervalWrapper,
} from './styled';

interface Props {
  weeklyValue: number;
  minValue?: number;
  maxValue?: number;
  onValueChange: (value: number) => void;
}

export const WeeklyGoal: React.FC<Props> = ({
  weeklyValue,
  onValueChange,
  minValue = 2,
  maxValue = 200,
}) => (
  <>
    <WeeklyGoalBlock>
      <WeeklyTitle>Weekly Goal</WeeklyTitle>
      <WeeklyValueWrapper>
        <WeeklyValue>{`$${Math.floor(weeklyValue)}`}</WeeklyValue>
      </WeeklyValueWrapper>
    </WeeklyGoalBlock>
    <SliderBlock>
      <Slider
        minimumValue={minValue}
        maximumValue={maxValue}
        value={weeklyValue}
        onValueChange={onValueChange}
      />
    </SliderBlock>
    <WeeklyIntervalWrapper>
      <WeeklyTitle>${minValue}</WeeklyTitle>
      <WeeklyTitle>${maxValue}</WeeklyTitle>
    </WeeklyIntervalWrapper>
  </>
);
