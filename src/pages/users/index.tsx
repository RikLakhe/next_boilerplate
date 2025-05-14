import { useUsers } from "@/app/hooks/useUsers"
import { wrapper } from "@/app/store"
import { deleteUser } from "@/app/store/users/users.service"
import { User } from "@/app/store/users/users.types"
import { GetServerSideProps } from "next"
import { Table, Button, Popconfirm } from 'antd'
import { loadUsers } from "@/app/store/users/users.slice"
import Link from "next/link"

const UsersPage = () => {
  const { users, loading } = useUsers()

  const handleDelete = async (id: string) => {
    await deleteUser(id)
    // re-load or dispatch(loadUsers())
    window.location.reload()
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
  ]
  
  return (
    <>
      <Link href="/users/create"><Button type="primary" style={{ marginBottom: 16 }}>Create User</Button></Link>
      <Table rowKey="id" dataSource={users} columns={columns} loading={loading} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
    (  store: { dispatch: (arg0: any) => any }) => async () => {
    // dispatch on server
    await store.dispatch(loadUsers())
    return { props: {} }
  }
)

export default UsersPage
