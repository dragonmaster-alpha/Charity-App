/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Navigation, RootState } from 'types';
import { useAction } from 'utils/hooks';
import {
  getCharitiesList,
  getFilterCharity,
  setFilterSelected,
  changeValue,
  setCheckedSelected,
  createUserCharity,
  resetCharityReducer,
} from 'modules/charity/actions';
import { CheckBox } from 'view/components/uiKit/CheckBox';
import { SearchInput } from 'view/components/uiKit/SearchInput';
import { EmptyView } from 'view/components/EmptyView';
import { FilterCheckbox } from 'view/components/FilterCheckbox';
import { Loader } from 'view/components/uiKit/Loader';

import {
  Container,
  Header,
  TopHeaderBlock,
  GoBackBlock,
  GoBackIcon,
  Title,
  BottomHeaderBlock,
  StyledKeyboardAvoidingView,
  MainBlock,
  ErrorBlock,
  ErrorTitlte,
  FlatListBlock,
  ButtonWrapper,
  StyledButton,
  ContainerList,
  ItemFilterWrapper,
  FilterTitle,
} from './styled';

interface Props {
  navigation: Navigation;
}

export const SelectCharityScreen: React.FC<Props> = ({ navigation }) => {
  const [notSelected, setNotSelected] = useState(1);
  const [isAll, setAllFilter] = useState(true);
  const [isShowInfo, setShowInfo] = useState(false);
  const route = navigation.state.params ? navigation.state.params.route : 'choose';
  const isEditViewScreen = route === 'edit';

  const {
    charitiesList,
    isLoadingCharitiesList,
    filterList,
    checkFilter,
    searchValue,
    checkSelected,
    isLoadingCreatedUserCharity,
    createdUserCharityError,
    getCharitiesListError,
  } = useSelector((state: RootState) => state.charityReducer);

  const { isCreatedUserCharity } = useSelector((state: RootState) => state.userReducer);

  const fetchCharitiesList = useAction(getCharitiesList);
  const fetchFilterCharity = useAction(getFilterCharity);
  const setFilterSelect = useAction(setFilterSelected);
  const changeSearchValue = useAction(changeValue);
  const setCheckSelected = useAction(setCheckedSelected);
  const createUserCharities = useAction(createUserCharity);
  const resetReducer = useAction(resetCharityReducer);

  const isShowError =
    Object.values(createdUserCharityError).length > 0 ||
    Object.values(getCharitiesListError).length > 0;

  useEffect(() => {
    resetReducer();
    fetchCharitiesList(true);
    fetchFilterCharity();
  }, []);

  useEffect(() => {
    if (isCreatedUserCharity) {
      if (isEditViewScreen) {
        navigation.navigate('HomeScreen', { route: 'update' });
      } else {
        navigation.navigate('SelectWeeklyAmount');
      }
    }
  }, [isCreatedUserCharity]);

  const toggleCheckBox = (title: number, label: number, isCheck: boolean) => {
    if (!isCheck) {
      checkSelected.push({ label });
    } else {
      const index = checkSelected.map(e => e.label).indexOf(label);
      if (index > -1) {
        checkSelected.splice(index, 1);
      }
    }
    if (checkSelected.length >= 1) {
      setShowInfo(false);
    }
    if (checkSelected.length === 3) {
      setNotSelected(0.5);
    } else {
      setNotSelected(1);
    }
    setCheckSelected(checkSelected);
  };

  let delayTimer: number;
  const doSearch = React.useCallback(value => {
    changeSearchValue(value);
    clearTimeout(delayTimer);
    delayTimer = setTimeout(() => {
      fetchCharitiesList(false);
    }, 1000); // Will do the the fetch data after 1000 ms, or 1 s
  }, []);

  let delayFilterTimer: number;
  const toggleFilterCheckBox = React.useCallback(
    (label, isCheck) => {
      if (!isCheck) {
        checkFilter.push({ label });
      } else {
        const index = checkFilter.map(e => e.label).indexOf(label);
        if (index > -1) {
          checkFilter.splice(index, 1);
        }
      }
      setFilterSelect(checkFilter);
      if (checkFilter.length === 0) {
        setAllFilter(true);
      } else {
        setAllFilter(false);
      }
      clearTimeout(delayFilterTimer);
      delayFilterTimer = setTimeout(() => {
        fetchCharitiesList(false);
      }, 1000);
    },
    [checkFilter],
  );

  const goToNext = React.useCallback(() => {
    if (checkSelected.length === 0) {
      setShowInfo(true);
    } else {
      createUserCharities();
    }
  }, [route, checkSelected]);

  const changeFilter = React.useCallback(() => {
    setAllFilter(true);
    setFilterSelect([]);
    fetchCharitiesList(false);
  }, [checkFilter]);

  const renderListItem = ({ item }: any) => {
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
          marginBottom: 8,
        }}
      >
        <CheckBox
          key={item.id}
          value={item.id}
          label={item.id}
          item={item}
          clicked={(title: any, label: any, isCheck: any) => {
            toggleCheckBox(title, label, isCheck);
          }}
          checkSelected={checkSelected}
          notSelected={notSelected}
        />
      </ContainerList>
    );
  };
  return (
    <Container>
      {/* header */}
      <Header isEditViewScreen={isEditViewScreen}>
        {isEditViewScreen && (
          <GoBackBlock onPress={() => navigation.goBack()}>
            <GoBackIcon />
          </GoBackBlock>
        )}
        <TopHeaderBlock>
          <Title>{isEditViewScreen ? 'Edit charities' : 'Select your charity'}</Title>
        </TopHeaderBlock>
        <BottomHeaderBlock>
          <SearchInput value={searchValue} onChangeText={doSearch} />
        </BottomHeaderBlock>
        <ScrollView
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {isLoadingCharitiesList || (
            <>
              <TouchableOpacity onPress={changeFilter}>
                <ItemFilterWrapper isCheck={isAll}>
                  <FilterTitle isCheck={isAll}>All</FilterTitle>
                </ItemFilterWrapper>
              </TouchableOpacity>
              {filterList.map(filterItem => (
                <FilterCheckbox
                  key={filterItem.id}
                  filterItem={filterItem}
                  value={filterItem.name}
                  label={filterItem.name}
                  clicked={(label: any, isCheck: any) => {
                    toggleFilterCheckBox(label, isCheck);
                  }}
                  checkSelected={checkFilter}
                />
              ))}
            </>
          )}
        </ScrollView>
      </Header>
      {/* main block */}
      <StyledKeyboardAvoidingView>
        <MainBlock>
          {isLoadingCharitiesList ? (
            <Loader />
          ) : (
            <>
              {isShowInfo && (
                <ErrorBlock>
                  <ErrorTitlte>Please select at least one charity from the list below</ErrorTitlte>
                </ErrorBlock>
              )}
              {isShowError && (
                <ErrorBlock>
                  <ErrorTitlte>
                    {String(Object.values(createdUserCharityError)) ||
                      String(Object.values(getCharitiesListError))}
                  </ErrorTitlte>
                </ErrorBlock>
              )}
              <FlatListBlock isShowInfo={isShowInfo || isShowError}>
                {charitiesList.length !== 0 ? (
                  <FlatList
                    data={charitiesList}
                    renderItem={renderListItem}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => String(item.id)}
                    bounces={false}
                    style={{
                      width: '100%',
                    }}
                  />
                ) : (
                  <EmptyView title="No charity found" />
                )}
              </FlatListBlock>
              <ButtonWrapper>
                <StyledButton
                  onPress={goToNext}
                  label={isEditViewScreen ? 'Save changes' : 'Next'}
                  loading={isLoadingCreatedUserCharity}
                  reverseLoader
                />
              </ButtonWrapper>
            </>
          )}
        </MainBlock>
      </StyledKeyboardAvoidingView>
    </Container>
  );
};
