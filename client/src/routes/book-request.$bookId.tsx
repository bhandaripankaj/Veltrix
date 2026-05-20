import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { bookAPI, bookRequestAPI } from "@/services/api";
import { motion } from "framer-motion";

const VITE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || 'http://localhost:4000'

export const Route = createFileRoute("/book-request/$bookId")({
  component: BookRequestPage,
  head: (ctx) => ({ meta: [{ title: `Request Book — ${ctx.params.bookId}` }] }),
});

function BookRequestPage() {
  const { bookId } = Route.useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await bookAPI.getById(bookId);
        setBook(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!name || !email || !phone) {
      setError('Please fill all fields.')
      return
    }
    setSubmitting(true);
    try {
      await bookRequestAPI.create({ name, email, phone, book: bookId });
      setSuccess('Interest sent — we will contact you soon.');
      setName(''); setEmail(''); setPhone('');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to send interest.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center p-8">Loading...</div>

  return (
    <div className="container-wide py-10 sm:py-14 md:py-16">
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
            {book?.cover && (
              <img src={VITE_IMAGE_URL + book.cover} alt={book.title} className="w-full h-full object-cover" />
            )}
          </div>
          <h1 className="mt-4 font-display text-2xl">{book?.title}</h1>
          <p className="text-sm text-muted-foreground">{book?.author}</p>
          <div className="mt-4 text-sm text-muted-foreground">{book?.description}</div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg">Send Interest</h2>
          <p className="text-sm text-muted-foreground mt-2">We will save your interest and contact you about this book.</p>

          <motion.form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-medium">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 input" />
            </div>
            <div>
              <label className="text-xs font-medium">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full mt-1 input" />
            </div>
            <div>
              <label className="text-xs font-medium">Phone Number</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 input" />
            </div>

            {error && <div className="text-sm text-destructive">{error}</div>}
            {success && <div className="text-sm text-success">{success}</div>}

            <div className="flex gap-3 mt-3">
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Sending...' : 'Send Interest'}
              </button>
              <Link to={`/books/${bookId}`} className="btn-outline">Back</Link>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  )
}
