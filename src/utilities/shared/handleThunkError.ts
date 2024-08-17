import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { httpActions } from 'store/http/httpSlice';

type HandleThunkErrorParams<RejectValueType> = {
  err: any;
  defaultMessage?: string;
  dispatch: Dispatch<AnyAction>;
  rejectWithValue: (value: string) => RejectValueType;
};

export const handleThunkError = <RejectValueType>({
  err,
  defaultMessage,
  dispatch,
  rejectWithValue,
}: HandleThunkErrorParams<RejectValueType>): RejectValueType => {
  console.error(err);
  const errorMessage = err.message || defaultMessage || 'Something went wrong!';
  dispatch(httpActions.requestError(errorMessage));
  return rejectWithValue(errorMessage);
};
