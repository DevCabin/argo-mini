import Head from 'next/head';
import ChatInterface from '../components/ChatInterface';

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Chat - Local LLM Assistant</title>
        <meta name="description" content="A standalone AI chat application that runs locally in your browser" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ChatInterface />
      </main>
    </>
  );
} 