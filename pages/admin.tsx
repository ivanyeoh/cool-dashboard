import type { NextPage } from 'next'
import Head from 'next/head'
import DashboardGrid from '../components/DashboardGrid'
import useQuery from '../hooks/useQuery'
import { post, put, remove } from '../utils/request'

const Admin: NextPage = () => {
  const { data } = useQuery("/dashboard-widgets")

  return (
    <div>
      <Head>
        <title>Dashboard | Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {data ? (
          <DashboardGrid
            widgets={data?.data?.widgets}
            onRemove={(id) => {
              remove(`/dashboard-widgets/${id}`)
            }}
            onAdd={(layout) => {
              post("/dashboard-widgets", {
                data: layout
              })
            }}
            onSwap={(a, b) => {
              put(`/dashboard-widgets/${a.i}/swap`, {
                data: {
                  swapWithId: b.i
                }
              })
            }}
            onResize={(layout) => {
              put(`/dashboard-widgets/${layout.i}`, {
                data: layout
              })
            }}
          />
        ) : <>Loading...</>}
      </main>
    </div>
  )
}

export default Admin
