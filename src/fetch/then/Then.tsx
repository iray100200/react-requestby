'use client';
import { memo } from 'react';
import type { JSX } from 'react';

declare type ChildrenType = null | string | JSX.Element

export declare interface ThenProps<T> {
  children?: (value: T) => ChildrenType;
}

declare interface ThenComponentProps {
  children: ChildrenType;
  value: unknown;
}

export const Then: <T>(props: ThenProps<T>) => ChildrenType = () => {
  return null
}

export const ThenComponent = memo(function ThenComponent(props: ThenComponentProps) {
  return props.children
})