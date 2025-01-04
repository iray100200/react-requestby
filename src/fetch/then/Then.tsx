'use client';
import { memo, useMemo } from 'react';
import type { ReactNode } from 'react';

export declare interface ThenProps {
  onReturn?: (value: any) => ReactNode;
  transform?: (value: any) => any;
  children?: ReactNode;
}

declare interface ThenComponentProps {
  value?: any;
  transform?: (value: any) => any;
  render?: (value: any) => ReactNode;
  children?: ReactNode;
}

export const Then: (props: ThenProps) => ReactNode = () => {
  return null
}

export const ThenComponent = memo(function ThenComponent(props: ThenComponentProps) {
  if (props.value === void 0) return null

  const value = useMemo(() => {
    if (props.transform) {
      return props.transform(props.value)
    }
    return props.value
  }, [props.transform, props.value])

  const result = useMemo(() => {
    if (!props.render) return props.children
    return props.render(value)
  }, [props.render, value, props.children])

  return result
})