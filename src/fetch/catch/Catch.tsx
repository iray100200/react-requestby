'use client';
import { memo } from 'react';
import type { JSX } from 'react';

declare type ChildrenType = null | string | JSX.Element;

export declare interface CatchProps {
  children?: (error: Error) => ChildrenType;
}

declare interface CatchComponentProps {
  children: ChildrenType;
  error: unknown;
}

export const Catch: (props: CatchProps) => ChildrenType = () => {
  return null
}

export const CatchComponent = memo(function CatchComponent(props: CatchComponentProps) {
  return props.children
})