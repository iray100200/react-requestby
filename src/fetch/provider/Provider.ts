'use client';
import { createContext } from 'react';

export declare type FetchOptions = {
  id: string;
  url: string;
  requestInit?: Partial<RequestInit>;
  responseType?: 'text' | 'json' | 'blob';
}[]

const FetchContext = createContext<FetchOptions>([])
const FetchProvider = FetchContext.Provider

export {
  FetchContext,
  FetchProvider
}