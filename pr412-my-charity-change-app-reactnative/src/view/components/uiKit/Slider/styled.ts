import styled from 'styled-components';
import Slider from 'react-native-slider';

export const StyledSlider = styled(Slider).attrs(props => ({
  minimumValue: props.minimumValue || 2,
  maximumValue: props.maximumValue || 200,
  trackStyle: {
    height: 6,
    borderRadius: 40,
  },
  thumbStyle: {
    width: 24,
    height: 24,
    borderRadius: 50,
    backgroundColor: 'white',
    borderColor: '#1E65BB',
    borderWidth: 4,
  },
  minimumTrackTintColor: '#1E65BB',
  maximumTrackTintColor: '#E4EDF7',
}))``;
