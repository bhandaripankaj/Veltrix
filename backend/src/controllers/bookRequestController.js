import BookRequest from '../models/BookRequest.js'
import Book from '../models/Book.js'

export const createBookRequest = async (req, res) => {
  try {
    const { name, email, phone, book, message } = req.body

    if (!name || !email || !phone || !book) {
      return res.status(400).json({ message: 'Name, email, phone and book ID are required' })
    }

    // ensure the book exists
    const found = await Book.findById(book)
    if (!found) return res.status(404).json({ message: 'Book not found' })

    const br = new BookRequest({ name, email, phone, book, message })
    await br.save()

    res.status(201).json({ message: 'Book request created', bookRequest: br })
  } catch (error) {
    console.error('Error creating book request:', error)
    res.status(500).json({ message: 'Failed to create book request' })
  }
}

export const getAllBookRequests = async (req, res) => {
  try {
    const requests = await BookRequest.find().sort({ createdAt: -1 }).populate('book', 'title author')
    res.json(requests)
  } catch (error) {
    console.error('Error fetching book requests:', error)
    res.status(500).json({ message: 'Failed to fetch book requests' })
  }
}

export const getBookRequestById = async (req, res) => {
  try {
    const reqId = req.params.id
    const bookRequest = await BookRequest.findById(reqId).populate('book')
    if (!bookRequest) return res.status(404).json({ message: 'Book request not found' })
    res.json(bookRequest)
  } catch (error) {
    console.error('Error fetching book request:', error)
    res.status(500).json({ message: 'Failed to fetch book request' })
  }
}
