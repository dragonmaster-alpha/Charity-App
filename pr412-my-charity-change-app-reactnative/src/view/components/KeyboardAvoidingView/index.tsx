import styled from 'styled-components';
import { isIOS } from 'utils/helpers';

export const KeyboardAvoidingView = styled.KeyboardAvoidingView.attrs({
  behavior: isIOS ? 'padding' : undefined,
})`
  flex: 1;
`;
