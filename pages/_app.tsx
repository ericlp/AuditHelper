import '../styles/index.css';

import React from 'react';

import type { AppProps } from 'next/app';
import Head from 'next/head';

import { Snackbar } from '../components/Snackbar/Snackbar';
import styles from '../styles/globals.module.css';
import { AccountingProvider } from '../utils/AccountingDataContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Revisors Hjälpen</title>
        <meta name="description" content="Automatisera jobbigt manuellt arbete" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1 className={styles.title}>Revisors Hjälpen</h1>
      </header>
      <main className={styles.main}>
        <AccountingProvider>
          <Component {...pageProps} />
        </AccountingProvider>
      </main>
      <Snackbar />
    </>
  );
}
