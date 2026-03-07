import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Shop = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/garden', { replace: true })
  }, [navigate])

  return null
}

export default Shop