import Head from 'next/head'
import DisplayChess from '../components/DisplayChess';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta> */}
        {/* <meta httpEquiv="Content-Security-Policy"
            content="default-src 'self' https: ; object-src 'none'" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DisplayChess />
    </div>
  )
}