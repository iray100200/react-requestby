# react-requestby
Declarative and predictable HTTP request components for React

# Install
```
npm i react-requestby
```
# Fetch example
```tsx
import { FetchProvider, FetchOptions, Fetch, Then, Catch, Pending, useSchedule } from 'react-requestby';
import { memo, useCallback, useState } from "react";

declare interface HelloResponse {
  message: string
}

const fetchConfig: FetchOptions = [
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
]

function App() {
  const [SchedulerProvider, scheduler] = useSchedule(false)

  const handleClick = useCallback(() => {
    scheduler.next('hello', { name: Math.random().toString() })
  }, [scheduler])

  return <div onClick={handleClick}>
    <div>The requests:</div>
    <SchedulerProvider>
      <Fetch target="error">
        <Catch>
          {
            (error) => {
              return error.message
            }
          }
        </Catch>
      </Fetch>
      <Fetch target="hello" searchParams={{
        name: Math.random().toString()
      }}>
        <Then<HelloResponse>>
          {
            (value) => value.message
          }
        </Then>
        <Pending>Loading...</Pending>
      </Fetch>
    </SchedulerProvider>
    <div>
      <Fetch target="hello2">
        <Then<HelloResponse>>
          {
            (value) => value.message
          }
        </Then>
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