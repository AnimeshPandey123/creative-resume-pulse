// Force React into development mode for testing
process.env.NODE_ENV = 'test'
process.env.REACT_APP_ENV = 'test'

// Force React to use development mode
process.env.__DEV__ = 'true'
process.env.__PROD__ = 'false'

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    // Uncomment to suppress specific console methods during tests
    // log: jest.fn(),
    // debug: jest.fn(),
    // info: jest.fn(),
    // warn: jest.fn(),
    // error: jest.fn(),
}
