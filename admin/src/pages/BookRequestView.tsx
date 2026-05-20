import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import '../styles/ManagementPages.css'

function BookRequestView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const [request, setRequest] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!id) return
      try {
        const res = await fetch(`/api/book-requests/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setRequest(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, token])

  if (loading) return <div className="content-section">Loading...</div>
  if (!request) return <div className="content-section">Not found</div>

  return (
    <section className="content-section">
      <div className="page-header">
        <h2>Book Request Details</h2>
      </div>

      <div className="card-soft p-6">
        <p><strong>Name:</strong> {request.name}</p>
        <p><strong>Email:</strong> {request.email}</p>
        <p><strong>Phone:</strong> {request.phone}</p>
        {request.message && <p><strong>Message:</strong> {request.message}</p>}
        <div className="mt-4">
          <h3>Book</h3>
          {request.book ? (
            <div>
              <p><strong>Title:</strong> {request.book.title}</p>
              <p><strong>Author:</strong> {request.book.author}</p>
            </div>
          ) : (
            <p>Book info unavailable</p>
          )}
        </div>

        <div className="mt-6">
          <button className="btn-outline" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </section>
  )
}

export default BookRequestView
