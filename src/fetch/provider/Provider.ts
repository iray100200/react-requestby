'use client';
import { createContext } from 'react';

export declare type FetchOptions = {
  id: string;
  url: string;
  requestInit?: Partial<RequestInit>;
  responseType?: 'text' | 'json' | 'blob';
}[]

export const FetchContext = createContext<FetchOptions>([])
export const FetchProvider = FetchContext.Provider