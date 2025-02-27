'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { FetchProvider, FetchOptions, Fetch, Then, Catch, Pending, useSchedule, useFetchResult } from 'react-requestby';
import { Component, memo, ReactNode, useCallback, useEffect, useState } from "react";

const Next = memo(function Next(props: { children: string }) {
  useEffect(() => {
    console.log('next ...')
  })
  return <div>Next div! {props.children}</div>
})

class Previous extends Component<unknown, unknown> {
  componentDidMount(): void {
    console.log('previous did mount')
  }

  render(): ReactNode {
    return 'Previous'
  }
}

declare interface HelloResponse {
  message: string
}

const fetchConfig = [
  {
    id: 'hello',
    url: '/api/hello',
    responseType: 'json',
    requestInit: {
      method: 'get',
      credentials: 'same-origin'
    }
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

const ThenResult = memo(function ThenResult() {
  const { value } = useFetchResult<{ message: string }>()
  return value?.message
})

function App() {
  const [SchedulerProvider, scheduler] = useSchedule<typeof fetchConfig[number]['id']>(false)

  const handleClick = useCallback(() => {
    scheduler.next('hello', { name: Math.random().toString() })
  }, [scheduler])

  const renderThen = useCallback((value: HelloResponse) => value.message, [])
  const renderError = useCallback((error: Error) => (<>
    <Next>{error.message}</Next>
    <Previous></Previous>
  </>), [])

  return <div onClick={handleClick}>
    <div>The requests:</div>
    <SchedulerProvider>
      <Fetch target="error">
        <Then onReturn={renderThen}></Then>
        <Catch onReturn={renderError} />
        <Pending>Loading...</Pending>
      </Fetch>
      <Fetch target="hello" searchParams={{
        name: Math.random().toString()
      }}>
        <Then>
          <ThenResult />
        </Then>
        <Pending>Loading...</Pending>
      </Fetch>
    </SchedulerProvider>
  </div>
}

export default function Home() {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    setCount(count + 1)
  }, [count])

  return (
    <div onClick={handleClick} className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>src/app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
      <FetchProvider value={fetchConfig}>
        <App />
      </FetchProvider>
    </div>
  )
}
