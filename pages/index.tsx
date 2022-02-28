import type { NextPage } from 'next'
import Head from 'next/head'
import DashboardGrid from '../components/DashboardGrid'
import useQuery from '../hooks/useQuery'

const Admin: NextPage = () => {
  const { data } = useQuery("/dashboard-widgets")

  return (
    <div>
      <Head>
        <title>Dashboard Challenge | Readonly</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {data ? (
          <DashboardGrid widgets={data?.data?.widgets} readOnly />
        ) : <>Loading...</>}
      </main>
    </div>
  )
}

export default Admin
