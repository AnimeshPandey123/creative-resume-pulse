// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Force React into development mode for testing
process.env.NODE_ENV = 'test'
process.env.REACT_APP_ENV = 'test'

// Force React to use development mode
process.env.__DEV__ = 'true'
process.env.__PROD__ = 'false'

// Mock React to ensure development mode
jest.mock('react', () => {
    const originalReact = jest.requireActual('react')
    return {
        ...originalReact,
        // Force development mode
        __DEV__: true,
    }
})

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
        }
    },
    useSearchParams() {
        return new URLSearchParams()
    },
    usePathname() {
        return '/'
    },
}))

// Mock Next.js metadata
jest.mock('next', () => ({
    ...jest.requireActual('next'),
    Metadata: jest.fn(),
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))
