const twilioMock = jest.fn().mockImplementation(() => ({
  calls: {
    create: jest.fn().mockResolvedValue({
      sid: 'CA_mock123',
    }),
  },
}));

export default twilioMock; 