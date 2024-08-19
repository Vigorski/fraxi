import { MutableRefObject } from 'react';
import { AutocompleteType } from './map';

export type AcRefType = MutableRefObject<AutocompleteType | null>;

export type FormErrors<T> = {
  [K in keyof T]?: string | string[];
};
