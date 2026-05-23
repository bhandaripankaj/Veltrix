import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import '../styles/ManagementPages.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const VITE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || 'http://localhost:4000/'
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
        const res = await fetch(`${API_BASE_URL}/book-requests/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
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

  if (loading) return <div className="content-section"><div className="detail-card">Loading request details...</div></div>
  if (!request) return <div className="content-section"><div className="detail-card">Request not found.</div></div>

  const book = typeof request.book === 'string' ? null : request.book

  return (
    <section className="content-section">
      <div className="page-header">
        <div>
          <h2>Book Request Details</h2>
          <p className="subtitle">Review the requester information and the selected book in one place.</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate(-1)}>Back</button>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <div className="detail-card-title">Requester Information</div>
          <div className="detail-row">
            <span className="detail-label">Name</span>
            <span className="detail-value">{request.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{request.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{request.phone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Requested On</span>
            <span className="detail-value">{new Date(request.createdAt).toLocaleString()}</span>
          </div>
          <div className="detail-row detail-row--stacked">
            <span className="detail-label">Message</span>
            <span className="detail-value detail-value--monospace">{request.message || 'No additional message provided.'}</span>
          </div>
        </div>

        <div className="detail-card detail-card--book">
          <div className="detail-card-title">Book Information</div>
          {book ? (
            <>
              {book.cover && (
                <div className="book-cover-wrapper">
                  <img src={`${VITE_IMAGE_URL}${book.cover}`} alt={book.title} className="book-cover" />
                </div>
              )}
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              <div className="book-meta">
                {book.subject && <span className="badge">{book.subject}</span>}
                {book.status && <span className={`badge badge--${book.status}`}>{book.status}</span>}
              </div>
              {book.description && <p className="book-description">{book.description}</p>}
              <div className="book-specs">
                {book.identificationNumber && (
                  <div className="detail-row">
                    <span className="detail-label">ISBN</span>
                    <span className="detail-value">{book.identificationNumber}</span>
                  </div>
                )}
                {book.publisher && (
                  <div className="detail-row">
                    <span className="detail-label">Publisher</span>
                    <span className="detail-value">{book.publisher}</span>
                  </div>
                )}
                {book.publishDate && (
                  <div className="detail-row">
                    <span className="detail-label">Published</span>
                    <span className="detail-value">{new Date(book.publishDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p>Book information is unavailable for this request.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default BookRequestView
