'use client';
import { createContext } from 'react';

export declare interface FetchOption {
  id: string;
  url: string;
  requestInit?: Partial<RequestInit>;
  responseType?: 'text' | 'json' | 'blob';
}

export declare type FetchOptions = FetchOption[]

const FetchContext = createContext<FetchOptions>([])
const FetchProvider = FetchContext.Provider

export {
  FetchContext,
  FetchProvider
}