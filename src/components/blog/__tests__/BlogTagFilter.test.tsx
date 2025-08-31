import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import BlogTagFilter from '@/components/blog/BlogTagFilter'

const push = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(''),
}))

jest.mock('@/components/ui/button', () => ({ Button: (props: any) => <button {...props} /> }))
jest.mock('@/components/ui/command', () => ({
  Command: ({ children }: any) => <div>{children}</div>,
  CommandEmpty: ({ children }: any) => <div>{children}</div>,
  CommandGroup: ({ children }: any) => <div>{children}</div>,
  CommandInput: ({ ...props }: any) => <input {...props} />,
  CommandItem: ({ children, onSelect, value }: any) => <div role="option" onClick={() => onSelect(value)}>{children}</div>,
  CommandList: ({ children }: any) => <div>{children}</div>,
}))
jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
}))

describe('BlogTagFilter', () => {
  it('opens and selects a specific tag, updating URL', () => {
    const { getByRole, getByText } = render(<BlogTagFilter />)
    fireEvent.click(getByRole('combobox'))
    const option = getByText('Python')
    fireEvent.click(option)
    expect(push).toHaveBeenCalled()
  })
})

