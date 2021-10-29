import React, { useEffect, useCallback, useState } from 'react';
import { CardIOView, CardIOUtilities } from 'react-native-awesome-card-io';
import { openSettings, check, PERMISSIONS } from 'react-native-permissions';

import { Navigation } from 'types';
import { useAction } from 'utils/hooks';

import * as Actions from 'modules/card/actions';

import { Button } from 'view/components/uiKit/Button';
import {
  Container,
  Header,
  TopHeaderBlock,
  GoBackBlock,
  GoBackIcon,
  Title,
  CameraBlockedContainer,
  CameraBlockedText,
} from './styled';

interface Props {
  navigation: Navigation;
}

const useCameraPermission = () => {
  const [cameraPermission, setCameraPermission] = useState('unavailable');

  useEffect(() => {
    const checkCameraPermissions = async () => {
      const cameraStatus = await check(PERMISSIONS.IOS.CAMERA);
      setCameraPermission(cameraStatus);
    };

    checkCameraPermissions();
  }, []);

  return cameraPermission;
};

// screen support IOS only for android check modules/card/sagas and AddCardScreen
export const ScanCardIOS: React.FC<Props> = ({ navigation }) => {
  const cameraPermission = useCameraPermission();
  const setScanCard = useAction(Actions.setScanCard);

  useEffect(() => {
    CardIOUtilities.preload();
  }, []);

  const didScanCard = useCallback(
    card => {
      setScanCard(card);
      navigation.navigate('AddCard');
    },
    [setScanCard],
  );

  return (
    <Container>
      {/* header */}
      <Header>
        <TopHeaderBlock>
          <GoBackBlock onPress={() => navigation.navigate('AddCard')}>
            <GoBackIcon />
          </GoBackBlock>
          <Title>Scan a card</Title>
        </TopHeaderBlock>
      </Header>
      {/* main block */}
      {cameraPermission === 'blocked' ? (
        <CameraBlockedContainer>
          <CameraBlockedText>You blocked access to the camera.</CameraBlockedText>
          <Button label="Open Settings" onPress={() => openSettings()} />
        </CameraBlockedContainer>
      ) : (
        <CardIOView
          didScanCard={didScanCard}
          hideCardIOLogo
          scanExpiry
          style={{ width: '100%', height: '100%', flex: 1 }}
        />
      )}
    </Container>
  );
};
