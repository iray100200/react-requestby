# react-requestby
Declarative and predictable HTTP request components for React

# Install
```
npm i react-requestby
```
# Fetch example
```tsx
import { FetchProvider, FetchOptions, Fetch, Then, Catch, Pending, useSchedule, useFetchResult } from 'react-requestby';
import { memo, useCallback, useState } from "react";

declare interface HelloResponse {
  message: string
}

const FetchResult = () => {
  const { value } = useFetchResult<HelloResponse>()
  return value.message
}

const fetchConfig = [
  {
    id: 'hello',
    url: '/api/hello',
    responseType: 'json'
  },
  {
    id: 'error',
    url: '/api/error',
    responseType: 'json'
  },
  {
    id: 'hello2',
    url: '/api/hello',
    responseType: 'json'
  }
] as const satisfies FetchOptions

function App() {
  const [SchedulerProvider, scheduler] = useSchedule(false)

  const renderThen = useCallback((value: HelloResponse) => value.message, [])
  const renderError = useCallback((error: Error) => <Next>{error.message}</Next>, [])

  const handleClick = useCallback(() => {
    scheduler.next('hello', { name: Math.random().toString() })
  }, [scheduler])

  return <div onClick={handleClick}>
    <div>The requests:</div>
    <SchedulerProvider>
      <Fetch target="error">
        <Catch onReturn={renderError} />
      </Fetch>
      <Fetch target="hello" searchParams={{
        name: Math.random().toString()
      }}>
        <Then>
          <FetchResult />
        </Then>
        <Pending>Loading...</Pending>
      </Fetch>
    </SchedulerProvider>
    <div>
      <Fetch target="hello2">
        <Then onReturn={renderThen} />
      </Fetch>
    </div>
  </div>
}

function Root() {
  return <FetchProvider value={fetchConfig}>
    <App />
  </FetchProvider>
}
```

# License
MIT License