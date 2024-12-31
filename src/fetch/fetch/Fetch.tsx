'use client';
import type { ReactElement, MemoExoticComponent, ComponentType, JSX } from 'react';
import { memo, useState, useEffect as effect, Children, useMemo, useContext } from 'react';
import { ThenComponent, Then, ThenProps } from '../then';
import { CatchComponent, Catch, CatchProps } from '../catch';
import { FetchContext } from '../provider';
import { Scheduler } from '../schedule';

declare type ChildrenType = null | string | JSX.Element;
declare type ResultCallback = { children: ChildrenType | ((value: unknown) => ChildrenType) }
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

const Fetch = memo(function Fetch(props: FetchProps) {
  const { id, scheduler, children } = props
  const [data, setData] = useState<Data>({ value: null, error: null })
  const [request, setRequest] = useState<Promise<Response>>()
  const context = useContext(FetchContext)
  const fetchConfig = useMemo(() => context.find(item => item.id === id), [])

  effect(() => {
    if (!scheduler) return
    scheduler.listen(id, (request: Promise<Response>) => {
      setRequest(request)
    })
  }, [id, scheduler])

  effect(() => {
    if (!fetchConfig) return
    const request = fetch(fetchConfig.url, fetchConfig.requestInit)
    setRequest(request)
  }, [id, fetchConfig])

  effect(() => {
    if (!request || !fetchConfig) return
    request.then((res) => {
      if (fetchConfig.responseType === 'json') {
        return res.json()
      }
      if (fetchConfig.responseType === 'text') {
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
    })
  }, [request, fetchConfig])

  return Children.map(children, (child) => {
    if (data.value && child.type === Then && typeof child.props.children === 'function') {
      return <ThenComponent key="then" value={data.value}>
        {child.props.children(data.value)}
      </ThenComponent>
    }
    if (data.error && child.type === Catch && typeof child.props.children === 'function') {
      return <CatchComponent key="catch" error={data.error}>
        {child.props.children(data.error)}
      </CatchComponent>
    }
    return child
  })
})

function useFetch() {
  const _Fetch = useMemo(() => Fetch, [])
  const _Then = useMemo(() => Then, [])
  const _Catch = useMemo(() => Catch, [])

  return {
    Fetch: _Fetch,
    Then: _Then,
    Catch: _Catch
  }
}

export {
  useFetch
}