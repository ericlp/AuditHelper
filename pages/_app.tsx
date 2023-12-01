import '../styles/index.css';

import React from 'react';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';

import { Snackbar } from '../components/Snackbar/Snackbar';
import styles from '../styles/globals.module.css';
import { BankProvider } from '../utils/contexts/BankContext';
import { LedgerProvider } from '../utils/contexts/LedgerContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Revisors Hjälpen</title>
        <meta name="description" content="Automatisera jobbigt manuellt arbete" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Link href={'/'}>
          <h1 className={styles.title}>Revisors Hjälpen</h1>
        </Link>
      </header>
      <main className={styles.main}>
        <BankProvider>
          <LedgerProvider>
            <Component {...pageProps} />
          </LedgerProvider>
        </BankProvider>
      </main>
      <Snackbar />
    </>
  );
}
