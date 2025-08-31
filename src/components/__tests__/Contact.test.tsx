import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import Contact from '@/components/Contact'

// Mock the toast hook to capture toast calls
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() })
}))

describe('Contact component', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    jest.clearAllMocks()
    global.fetch = originalFetch as any
  })

  it('renders contact section and form fields', () => {
    const { getByRole, getByLabelText, getByText } = render(<Contact />)

    expect(getByRole('region', { name: /get in touch/i })).toBeInTheDocument()
    expect(getByLabelText('Your Name')).toBeInTheDocument()
    expect(getByLabelText('Your Email')).toBeInTheDocument()
    expect(getByLabelText('Message')).toBeInTheDocument()
    expect(getByText('Send Message')).toBeInTheDocument()
  })

  it('submits the form successfully and shows success toast', async () => {
    const toastSpy = jest.fn()
    ;(require('@/hooks/use-toast') as any).useToast = () => ({ toast: toastSpy })

    global.fetch = jest.fn().mockResolvedValue({ ok: true }) as any

    const { getByLabelText, getByText } = render(<Contact />)

    fireEvent.change(getByLabelText('Your Name'), { target: { value: 'John Doe' } })
    fireEvent.change(getByLabelText('Your Email'), { target: { value: 'john@example.com' } })
    fireEvent.change(getByLabelText('Message'), { target: { value: 'Hello!' } })

    fireEvent.click(getByText('Send Message'))

    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalled()
    })

    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Message sent!' })
    )
  })

  it('handles submission error and shows error toast', async () => {
    const toastSpy = jest.fn()
    ;(require('@/hooks/use-toast') as any).useToast = () => ({ toast: toastSpy })

    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as any

    const { getByLabelText, getByText } = render(<Contact />)

    fireEvent.change(getByLabelText('Your Name'), { target: { value: 'Jane' } })
    fireEvent.change(getByLabelText('Your Email'), { target: { value: 'jane@example.com' } })
    fireEvent.change(getByLabelText('Message'), { target: { value: 'Hi' } })

    fireEvent.click(getByText('Send Message'))

    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalled()
    })

    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Message not sent!' })
    )
  })
})

