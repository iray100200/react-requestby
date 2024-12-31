'use client';

import { useContext, useMemo } from "react";
import { FetchContext, FetchOptions } from "../provider";

export class Scheduler<T = string> {
  private listeners: Map<T, ((request: Promise<Response>) => void)> = new Map()
  
  constructor(private context: FetchOptions) {

  }

  /**
   * @description The next() method is used for initiating a new HTTP request by fetch API.
   * @param id The fetch option id defined in the FetchOption
   * @param query The query params contained in the URL
   * @param requestInit The RequestInit dictionary of the Fetch API represents the set of options that can be used to configure a fetch request
   * @returns void
   */
  public next(id: T, query?: { [key: string]: string }, requestInit?: Partial<RequestInit>): void {
    const config = this.context.find(item => item.id === id)
    if (!config) return
    const url = new URL(config.url, location.origin)
    for (let key in query) {
      url.searchParams.set(key, query[key])
    }
    const request = fetch(url, {
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
  public listen(id: T, callback: (request: Promise<Response>) => void): void {
    this.listeners.set(id, callback)
  }
}

export function useSchedule(): Scheduler {
  const context = useContext(FetchContext)
  if (!context) {
    throw new Error('useSchedule must be used in a Provider!')
  }
  const schedule = useMemo(() => new Scheduler(context), [])
  return schedule
}