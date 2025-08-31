import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import BlogImageGallery from '@/components/blog/BlogImageGallery'

jest.mock('next/image', () => ({ __esModule: true, default: (props: any) => <img alt={props.alt} src={props.src} /> }))

const images = [
  { src: '/a.jpg', alt: 'A', caption: 'cap a' },
  { src: '/b.jpg', alt: 'B' },
]

describe('BlogImageGallery', () => {
  it('opens modal and navigates images', () => {
    const { getByAltText, getByLabelText, getByText } = render(<BlogImageGallery images={images} />)
    fireEvent.click(getByAltText('A'))
    expect(getByText('1 / 2')).toBeInTheDocument()
    fireEvent.click(getByLabelText('Next image'))
    expect(getByText('2 / 2')).toBeInTheDocument()
    fireEvent.click(getByLabelText('Previous image'))
    expect(getByText('1 / 2')).toBeInTheDocument()
    fireEvent.click(getByLabelText('Close modal'))
  })
})

