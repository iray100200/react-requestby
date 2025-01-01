'use client';
import { memo } from 'react';
import type { ReactNode } from 'react';

export declare interface ThenProps<T> {
  children?: (value: T) => ReactNode;
}

declare interface ThenComponentProps {
  children: ReactNode;
  value: unknown;
}

export const Then: <T>(props: ThenProps<T>) => ReactNode = () => {
  return null
}

export const ThenComponent = memo(function ThenComponent(props: ThenComponentProps) {
  return props.children
})