import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

export const useUser = () => {
  const user = useSelector((store: RootState) => store.user)
  return user
}
