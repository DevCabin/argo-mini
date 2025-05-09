import React from 'react';
import '../styles/globals.scss';
import { SessionDice } from '../components/SessionDice';

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <SessionDice />
    </>
  );
}

export default App; 