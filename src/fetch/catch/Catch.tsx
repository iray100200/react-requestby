'use client';
import { memo, useMemo } from 'react';
import type { ReactNode } from 'react';

export declare interface CatchProps {
  onReturn?: (error: Error) => ReactNode;
  children?: ReactNode;
}

declare interface CatchComponentProps {
  render?: (error?: Error) => ReactNode;
  error?: Error;
  children?: ReactNode;
}

export const Catch: (props: CatchProps) => ReactNode = () => {
  return null
}

export const CatchComponent = memo(function CatchComponent(props: CatchComponentProps) {
  if (!props.error) {
    return null
  }
  const result = useMemo(() => {
    if (!props.render) return props.children
    return props.render(props.error)
  }, [props.render, props.error, props.children])
  return result
})