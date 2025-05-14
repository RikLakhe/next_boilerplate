import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { loadUsers } from '../store/users/users.slice'
import { selectUsers, selectUsersLoading } from '../store/users/users.selectors'

export function useUsers() {
  const dispatch = useDispatch()
  const users = useSelector(selectUsers)
  const loading = useSelector(selectUsersLoading)
  useEffect(() => {
    dispatch(loadUsers() as any)
  }, [dispatch])

  return { users, loading }
}
