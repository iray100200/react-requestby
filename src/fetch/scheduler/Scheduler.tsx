'use client';
import type { NamedExoticComponent } from 'react';
import { memo, createContext, ReactNode, useContext, useMemo } from "react";
import { FetchContext, FetchOptions } from "../provider";

declare interface SchedulerProviderProps {
  children: ReactNode;
}

export class Scheduler<T = string> {
  private listeners: Map<T, (request: () => Promise<Response>) => void> = new Map()

  constructor(private context: FetchOptions, public always: boolean) { }

  /**
   * @description The next() method is used for initiating a new HTTP request by fetch API.
   * @param id The fetch option id defined in the FetchOption
   * @param query The query params contained in the URL
   * @param requestInit The RequestInit dictionary of the Fetch API represents the set of options that can be used to configure a fetch request
   * @returns void
   */
  public next(id: T, searchParams?: { [key: string]: string }, requestInit?: Partial<RequestInit>): void {
    const config = this.context.find(item => item.id === id)
    if (!config) return
    const url = new URL(config.url, location.origin)
    for (let key in searchParams) {
      url.searchParams.set(key, searchParams[key])
    }
    const request = () => fetch(url, {
      ...config.requestInit,
      ...requestInit
    })
    const cb = this.listeners.get(id)
    if (cb) cb(request)
  }

  /**
   * @description The listen() method of the fetch option id sets up a function that will be called whenever the next function is invoked.
   * @param id The fetch option id defined in the FetchOption
   * @param callback The callback will be immediately excuted once the above next function is invoked
   */
  public listen(id: T, callback: (request: () => Promise<Response>) => void): void {
    this.listeners.set(id, callback)
  }
}

/**
 * A hook that's used for returning a Scheduler
 * @param always An indicator that indicates if all the request should be managed by A Scheduler, if set true, the initial request will be skipped
 * @returns Scheduler
 */
export function useSchedule<T = string>(always: boolean = false): [NamedExoticComponent<SchedulerProviderProps>, Scheduler<T>] {
  const fetchContext = useContext(FetchContext)
  const scheduler = useMemo(() => new Scheduler<T>(fetchContext, always), [fetchContext, always])
  const SchedulerProvider = useMemo(() => memo(function SchedulerProvider(props: SchedulerProviderProps) {
    if (!fetchContext) {
      throw new Error('useSchedule must be used in a FetchProvider!')
    }
    return <SchedulerContext.Provider value={scheduler}>
      {props.children}
    </SchedulerContext.Provider>
  }), [scheduler])
  return [SchedulerProvider, scheduler]
}

export const SchedulerContext = createContext<Scheduler<unknown> | null>(null)