export class NextResponse {
  public readonly status: number;
  public readonly headers: Headers;
  private body: any;

  constructor(body: any, init: { status?: number; headers?: HeadersInit } = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.headers = new Headers(init.headers);
  }

  static json(data: any, init: { status?: number; headers?: HeadersInit } = {}) {
    const body = JSON.stringify(data);
    return new NextResponse(body, {
      ...init,
      headers: {
        ...Object.fromEntries(new Headers(init.headers || {}).entries()),
        'content-type': 'application/json',
      },
    });
  }

  async json() {
    if (typeof this.body === 'string') {
      return JSON.parse(this.body);
    }
    return this.body;
  }
}

export class NextRequest {
  public readonly url: string;
  public readonly method: string;
  private _body: any;

  constructor(url: string, init: { method?: string; body?: any } = {}) {
    this.url = url;
    this.method = init.method || 'GET';
    this._body = init.body;
  }

  async json() {
    if (typeof this._body === 'string') {
      try {
        return JSON.parse(this._body);
      } catch (e) {
        return {};
      }
    }
    return this._body || {};
  }

  get body() {
    return this._body;
  }
}

export const cookies = () => {
  return {
    get: jest.fn(),
    getAll: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    has: jest.fn(),
  };
};

export default {
  NextRequest,
  NextResponse,
  cookies,
}; 