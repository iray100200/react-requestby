'use client';
import { memo } from 'react';
import type { ReactNode } from 'react';

export declare interface PendingProps {
  children?: ReactNode;
}

export const Pending: (props: PendingProps) => ReactNode = memo((props: PendingProps) => {
  return props.children
})
