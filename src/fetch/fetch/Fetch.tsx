'use client';
import type { ReactElement, MemoExoticComponent, ComponentType, ReactNode, JSX } from 'react';
import { memo, useState, useEffect as effect, Children, useMemo, useContext, useCallback } from 'react';
import { ThenComponent, Then, ThenProps } from '../then';
import { CatchComponent, Catch, CatchProps } from '../catch';
import { FetchContext } from '../provider';
import { Scheduler, SchedulerContext } from '../scheduler';
import { Pending } from '../pending';

declare type ResultCallback = { children: ReactNode | ((value: unknown) => ReactNode) }
declare type Child = ReactElement<ResultCallback, MemoExoticComponent<ComponentType<ThenProps<unknown> | CatchProps>>>

declare interface FetchProps extends RequestInit {
  target: string;
  children: Child | Child[];
  scheduler?: Scheduler;
  searchParams?: {
    [key: string]: string
  }
}

declare interface Data<T = unknown> {
  value: T | null;
  error: Error | null;
}

export const Fetch = memo(function Fetch(props: FetchProps) {
  const { target, scheduler, children, searchParams, ...requestInit } = props

  //#regions states
  const [data, setData] = useState<Data>({ value: null, error: null })
  const [pending, setPending] = useState(false)
  const [request, setRequest] = useState<(() => Promise<Response>)[]>([])
  //#endregion

  //#region context
  const fetchContext = useContext(FetchContext)
  const schedulerContext = useContext(SchedulerContext)
  //#endregion

  //#region memos
  const fetchOption = useMemo(() => fetchContext.find(item => item.id === target), [])
  const pendingNodes = useMemo(() => Children.toArray(children).filter((child) => (child as JSX.Element).type === Pending), [children])
  //#endregion

  //#region callbacks
  const renderContent = useCallback((children: unknown, data: unknown) => {
    return typeof children === 'function' ? children(data) : children
  }, [])
  //#endregion

  effect(() => {
    if (!schedulerContext) return
    schedulerContext.listen(target, (request) => {
      setRequest([request])
    })
  }, [target, schedulerContext])

  effect(() => {
    if (!fetchOption) return
    if (schedulerContext && schedulerContext.always) return
    const url = new URL(fetchOption.url, location.origin)
    for (const key in searchParams) {
      url.searchParams.set(key, searchParams[key])
    }
    const request = () => fetch(url, {
      ...fetchOption.requestInit,
      ...requestInit
    })
    setRequest([request])
  }, [target, schedulerContext, fetchOption])

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
