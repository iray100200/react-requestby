'use client';
import type { ReactElement, MemoExoticComponent, ComponentType, JSX } from 'react';
import { memo, useState, useEffect as effect, Children, useMemo, useContext, createContext } from 'react';
import { ThenComponent, Then, ThenProps } from '../then';
import { CatchComponent, Catch, CatchProps } from '../catch';
import { FetchContext } from '../provider';
import { SchedulerContext } from '../scheduler';
import { Pending } from '../pending';

declare type Child = ReactElement<ThenProps, MemoExoticComponent<ComponentType<ThenProps | CatchProps>>>

declare interface FetchProps extends RequestInit {
  target: string;
  children: Child | Child[];
  searchParams?: {
    [key: string]: string
  }
}

declare interface FetchResult<T = any> {
  value?: T;
  error?: Error;
}

export const FetchResultContext = createContext<FetchResult>({})

export const Fetch = memo(function Fetch<T = any>(props: FetchProps) {
  const { target, children, searchParams, ...requestInit } = props

  //#regions states
  const [data, setData] = useState<FetchResult<T>>({})
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
    setData({})
    request[0]().then((res) => {
      if (fetchOption.responseType === 'json') {
        return res.json()
      }
      if (fetchOption.responseType === 'text') {
        return res.text()
      }
    }).then((value) => {
      setData({
        value: value || null,
        error: void 0
      })
    }).catch((error) => {
      setData({
        error: error || new Error(),
        value: void 0
      })
    }).finally(() => {
      setPending(false)
    })
  }, [request, fetchOption])

  if (pendingNodes.length > 0 && pending) {
    return pendingNodes
  }
  return <FetchResultContext.Provider value={data}>
    {
      Children.map(children, (child, index) => {
        if (child.type === Then) {
          return <ThenComponent key={`then${index}`} value={data.value} transform={child.props.transform} render={child.props.onReturn}>
            {child.props.children}
          </ThenComponent>
        }
        if (child.type === Catch) {
          return <CatchComponent key={`catch${index}`} error={data.error} render={child.props.onReturn}>
            {child.props.children}
          </CatchComponent>
        }
        if (child.type === Pending) {
          return null
        }
        return child
      })
    }
  </FetchResultContext.Provider>
})

export function useFetchResult<T>() {
  return useContext<FetchResult<T>>(FetchResultContext)
}