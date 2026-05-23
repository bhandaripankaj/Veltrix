import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import '../styles/ManagementPages.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

interface BookRequest {
  _id: string
  name: string
  email: string
  phone: string
  message?: string
  book: { _id?: string; title?: string; author?: string } | string
  createdAt: string
}

function BookRequests() {
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const [requests, setRequests] = useState<BookRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE_URL}/book-requests`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setRequests(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  return (
    <section className="content-section">
      <div className="page-header">
        <h2>Book Requests</h2>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="management-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Book</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.phone}</td>
                  <td>{typeof r.book === 'string' ? r.book : r.book?.title}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="action-buttons">
                    <button className="btn-sm" onClick={() => navigate(`/book-requests/${r._id}`)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

export default BookRequests
