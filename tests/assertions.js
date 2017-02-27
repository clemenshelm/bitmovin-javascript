export const mockGet = jest.fn().mockReturnValue(Promise.resolve({}));
export const mockPost = jest.fn().mockReturnValue(Promise.resolve({}));
export const mockDelete = jest.fn().mockReturnValue(Promise.resolve({}));
export const mockHttp = { get: mockGet, post: mockPost, delete_: mockDelete };

export const methodToMock = (method) => {
  if (method.toLowerCase() === 'get')
    return mockGet;
  return mockPost;
}


export const assertPayload = (mock, call, expectedPayload) => {
  it ('should send appropriate payload', () => {
    return call().then(() => {
      expect(mock.mock.calls[0][2]).toEqual(expectedPayload);
    });
  });
}

export const assertItReturnsUnderlyingPromise = (mock, call) => {
  it ('should return post promise', () => {
    mock.mockReturnValue(Promise.resolve("success"));
    const retVal = call();
    expect(retVal).toEqual(expect.any(Promise));
    return retVal.then((response, rawResponse) => {
      expect(response).toEqual("success");
    });
  });
};

export const assertItCallsCorrectUrl = (method, expectedUrl, fn) => {
  it (`should call ${method} ${expectedUrl} once`, () => {
    return fn().then(() => {
      expect(methodToMock(method)).toBeCalled();
    });
  });

  it (`should call ${method} with ${expectedUrl}`, () => {
    return fn().then(() => {
      expect(methodToMock(method).mock.calls[0][1]).toEqual(expect.stringMatching(expectedUrl));
    });
  });
}
