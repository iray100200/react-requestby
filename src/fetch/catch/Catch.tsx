'use client';
import { memo } from 'react';
import type { ReactNode } from 'react';

export declare interface CatchProps {
  children?: (error: Error) => ReactNode;
}

declare interface CatchComponentProps {
  children: ReactNode;
  error: unknown;
}

export const Catch: (props: CatchProps) => ReactNode = () => {
  return null
}

export const CatchComponent = memo(function CatchComponent(props: CatchComponentProps) {
  return props.children
})