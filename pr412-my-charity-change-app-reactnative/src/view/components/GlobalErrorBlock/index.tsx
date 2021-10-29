import React from 'react';

import { ResponseErrors } from 'types/responseData';

import { ErrorBlock, ErrorTitlte } from './styled';

export const globalErrorBlock = (globalError: ResponseErrors) => {
  return (
    Object.values(globalError).length > 0 && (
      <ErrorBlock>
        <ErrorTitlte>{Object.values(globalError)}</ErrorTitlte>
      </ErrorBlock>
    )
  );
};
