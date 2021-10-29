/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, memo, useMemo, useRef, useState } from 'react';
import { ScrollView, KeyboardAvoidingView, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import { useAction } from 'utils/hooks';
import { pick, bottomSpace, isIOS } from 'utils/helpers';
import { RootState, Navigation } from 'types';

import * as Actions from 'modules/auth/actions';

import eye from 'assets/img/eye.png';

import { Input } from 'view/components/uiKit/Input';
import { globalErrorBlock } from 'view/components';
import { moderateScale } from 'react-native-size-matters';
import { Header, Title, InputWrapper, StyledButton, EyeWrap, Eye } from './styled';

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    paddingTop: moderateScale(16, 0.5),
    paddingHorizontal: moderateScale(16, 0.5),
    paddingBottom: bottomSpace || moderateScale(16, 0.5),
  },
  innerBottom: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 25,
  },
});

interface Props {
  navigation: Navigation;
}

const KeyboarAwareContainer: React.FC = ({ children }) => {
  if (isIOS) {
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        {children}
      </KeyboardAvoidingView>
    );
  }
  return <>{children}</>;
};

export const SignUpScreen: React.FC<Props> = memo(({ navigation }) => {
  let inputElementFirst = useRef(null);
  let inputElementSecond = useRef(null);
  let inputElementThird = useRef(null);
  const [passwordType, setPasswordType] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const { values, errors, registerStatus } = useSelector((state: RootState) => state.authReducer);
  const { userId } = useSelector((state: RootState) => state.userReducer);

  const changeValue = useAction(Actions.changeValue);
  const auth = useAction(Actions.register);

  useEffect(() => {
    if (userId) {
      navigation.navigate('SelectCharity', { route: 'choose' });
    }
  }, [userId]);

  const isButtonDisabled = useMemo(() => {
    const required = pick(values, ['first_name', 'last_name', 'email', 'password']);
    return (
      Object.values(required).some(v => !v.trim()) ||
      (Object.keys(errors)[0] !== 'object_error' && Object.values(errors).some(v => !!v.trim()))
    );
  }, [values, errors]);

  return (
    <View style={{ flex: 1 }}>
      {/* header */}
      <Header>
        <Title>Let’s do this!</Title>
      </Header>
      {/* main block */}
      <KeyboarAwareContainer>
        <View style={{ flex: 1 }}>
          {Object.keys(errors).length === 1 &&
            Object.keys(errors)[0] === 'object_error' &&
            globalErrorBlock(errors)}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ref={scrollViewRef}
            contentContainerStyle={styles.contentContainerStyle}
          >
            <View style={{ flex: 1 }}>
              <InputWrapper>
                <Input
                  label="First Name"
                  placeholder="Alex"
                  maxLength={50}
                  key="first_name"
                  textContentType="name"
                  value={values.first_name}
                  onChangeText={(value: string) => changeValue({ first_name: value })}
                  error={errors.first_name}
                  autoCapitalize="sentences"
                  blurOnSubmit={false}
                  onSubmitEditing={() => inputElementFirst.focus()}
                />
              </InputWrapper>
              <InputWrapper>
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  maxLength={50}
                  key="last_name"
                  textContentType="name"
                  value={values.last_name}
                  onChangeText={(value: string) => changeValue({ last_name: value })}
                  error={errors.last_name}
                  autoCapitalize="sentences"
                  blurOnSubmit={false}
                  inputRef={(input: React.MutableRefObject<null>) => {
                    inputElementFirst = input;
                  }}
                  onSubmitEditing={() => {
                    inputElementSecond.focus();
                  }}
                />
              </InputWrapper>
              <InputWrapper>
                <Input
                  onFocus={() => {
                    if (scrollViewRef.current) {
                      scrollViewRef.current.scrollToEnd({ animated: true });
                    }
                  }}
                  label="Email Address"
                  placeholder="example@mail.com"
                  maxLength={50}
                  key="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  autoCompleteType="email"
                  value={values.email}
                  blurOnSubmit={false}
                  onChangeText={(value: string) => changeValue({ email: value })}
                  error={errors.email}
                  inputRef={(input: React.MutableRefObject<null>) => {
                    inputElementSecond = input;
                  }}
                  onSubmitEditing={() => {
                    inputElementThird.focus();
                  }}
                />
              </InputWrapper>
              <InputWrapper>
                <Input
                  onFocus={() => {
                    if (scrollViewRef.current) {
                      scrollViewRef.current.scrollToEnd({ animated: true });
                    }
                  }}
                  label="Password"
                  placeholder="Password"
                  secureTextEntry={passwordType}
                  maxLength={50}
                  key="password"
                  textContentType="password"
                  autoCompleteType="password"
                  value={values.password}
                  onChangeText={(value: string) => changeValue({ password: value })}
                  error={errors.password}
                  inputRef={(input: React.MutableRefObject<null>) => {
                    inputElementThird = input;
                  }}
                  rightComponent={
                    // eslint-disable-next-line react/jsx-wrap-multilines
                    <EyeWrap onPress={() => setPasswordType(!passwordType)}>
                      <Eye source={eye} />
                    </EyeWrap>
                  }
                />
              </InputWrapper>
            </View>
            <View style={styles.innerBottom}>
              <StyledButton
                disabled={isButtonDisabled}
                onPress={auth}
                loading={registerStatus}
                reverseLoader
              />
            </View>
          </ScrollView>
        </View>
      </KeyboarAwareContainer>
    </View>
  );
});
