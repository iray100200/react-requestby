'use client';
import type { ReactElement, MemoExoticComponent, ComponentType, ReactNode, JSX } from 'react';
import { memo, useState, useEffect as effect, Children, useMemo, useContext, useCallback } from 'react';
import { ThenComponent, Then, ThenProps } from '../then';
import { CatchComponent, Catch, CatchProps } from '../catch';
import { FetchContext } from '../provider';
import { Scheduler } from '../schedule';
import { Pending } from '../pending';

declare type ResultCallback = { children: ReactNode | ((value: unknown) => ReactNode) }
declare type Child = ReactElement<ResultCallback, MemoExoticComponent<ComponentType<ThenProps<unknown> | CatchProps>>>

declare interface FetchProps {
  id: string;
  children: Child | Child[];
  scheduler?: Scheduler;
}

declare interface Data<T = unknown> {
  value: T | null;
  error: Error | null;
}

export const Fetch = memo(function Fetch(props: FetchProps) {
  const { id, scheduler, children } = props
  const [data, setData] = useState<Data>({ value: null, error: null })
  const [pending, setPending] = useState(false)
  const [request, setRequest] = useState<(() => Promise<Response>)[]>([])
  const context = useContext(FetchContext)
  const fetchOption = useMemo(() => context.find(item => item.id === id), [])
  const pendingNodes = useMemo(() => Children.toArray(children).filter((child) => (child as JSX.Element).type === Pending), [children])
  const renderContent = useCallback((children: unknown, data: unknown) => {
    return typeof children === 'function' ? children(data) : children
  }, [])

  effect(() => {
    if (!scheduler) return
    scheduler.listen(id, (request) => {
      setRequest([request])
    })
  }, [id, scheduler])

  effect(() => {
    if (!fetchOption) return
    const request = () => fetch(fetchOption.url, fetchOption.requestInit)
    setRequest([request])
  }, [id, fetchOption])

  effect(() => {
    if (request.length === 0 || !fetchOption) return
    setPending(true)
    request[0]().then((res) => {
      if (fetchOption.responseType === 'json') {
        return res.json()
      }
      if (fetchOption.responseType === 'text') {
        return res.text()
      }
    }).then((value) => {
      setData({
        value,
        error: null
      })
    }).catch((error) => {
      setData({
        error,
        value: null
      })
    }).finally(() => {
      setPending(false)
    })
  }, [request, fetchOption])

  if (pendingNodes.length > 0 && pending) {
    return pendingNodes
  }
  return Children.map(children, (child) => {
    if (data.value && child.type === Then) {
      return <ThenComponent key="then" value={data.value}>
        {renderContent(child.props.children, data.value)}
      </ThenComponent>
    }
    if (data.error && child.type === Catch && typeof child.props.children === 'function') {
      return <CatchComponent key="catch" error={data.error}>
        {renderContent(child.props.children, data.error)}
      </CatchComponent>
    }
    if (child.type === Pending) {
      return null
    }
    return child
  })
})
