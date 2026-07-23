import {useState, useEffect} from 'react'
import apiClient from '@/utils/axiosConfig'
import { handleUnauthorizedError } from '@/utils/errorHandler';

export const useDashboardStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const res = await apiClient.get('/admin/dashboard-stats')
        setStats(res.data)
      } catch (err) {
        setError(err)
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats()
  }, [])
  
  return {stats, loading, error}
}