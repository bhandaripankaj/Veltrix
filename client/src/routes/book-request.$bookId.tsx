import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { bookAPI, bookRequestAPI } from "@/services/api";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const VITE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || 'http://localhost:4000'

export const Route = createFileRoute("/book-request/$bookId")({
  component: BookRequestPage,
  head: (ctx) => ({ meta: [{ title: `Request Book — ${ctx.params.bookId}` }] }),
});

function BookRequestPage() {
  const { bookId } = Route.useParams();
  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
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
    if (!name || !email || !phone) {
      setError('Please fill all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await bookRequestAPI.create({ name, email, phone, book: bookId, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to send interest.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center p-8">Loading...</div>;

  return (
    <div className="container-wide py-10 sm:py-14 md:py-16 pb-32">
      <div className="grid lg:grid-cols-2 gap-12">
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

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border bg-card p-8 md:p-12 h-fit"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          <h2 className="font-display text-2xl">Send interest</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We will save your interest and contact you about this book.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            <Field
              label="Your name"
              id="br-name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Field
              label="Email"
              id="br-email"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="sm:col-span-2">
              <Field
                label="Phone"
                id="br-phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="br-message" className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Message
            </label>
            <textarea
              id="br-message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any questions about this book, format, or delivery?"
              className="w-full rounded-2xl bg-background border border-border px-5 py-4 outline-none focus:border-gold transition-colors resize-none"
            />
          </div>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={submitting || success}
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-gold text-gold-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitting ? "Sending..." : success ? "Thanks — we'll be in touch" : "Send interest"}
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <Link to="/books/$bookId" params={{ bookId }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Back to book
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-12 rounded-2xl bg-background border border-border px-5 outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}
