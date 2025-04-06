export const headers = jest.fn().mockReturnValue({
  get: jest.fn(),
  has: jest.fn(),
  entries: jest.fn(),
  keys: jest.fn(),
  values: jest.fn(),
  forEach: jest.fn(),
});

export default {
  headers,
}; 