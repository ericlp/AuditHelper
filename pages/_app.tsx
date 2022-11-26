import '../styles/globals.css';

import React from 'react';

import type { AppProps } from 'next/app';
import Head from 'next/head';

import { Snackbar } from '../components/Snackbar/Snackbar';
import styles from '../styles/Home.module.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>AuditHelper</title>
          <meta name="description" content="Automate tedious comparisons" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <Component {...pageProps} />
        </main>
        <Snackbar />
      </div>
    </>
  );
}
