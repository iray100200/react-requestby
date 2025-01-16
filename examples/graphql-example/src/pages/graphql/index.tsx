import { ApolloSandbox } from '@apollo/sandbox/react';
import styles from './graphql.module.css';

export default function App() {
  return (
    <ApolloSandbox className={styles.sandbox} />
  )
}