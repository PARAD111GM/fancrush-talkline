const stripeMock = jest.fn().mockImplementation(() => ({
  customers: {
    create: jest.fn().mockResolvedValue({
      id: 'cus_mock123',
    }),
  },
  checkout: {
    sessions: {
      create: jest.fn().mockResolvedValue({
        url: 'https://checkout.stripe.com/mock-session',
      }),
    },
  },
  webhooks: {
    constructEvent: jest.fn(),
  },
}));

export default stripeMock; 