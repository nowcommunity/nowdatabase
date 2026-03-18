// Polyfill for React Router's data router in Jest environment
// See: https://github.com/remix-run/react-router/discussions/9851
import '@testing-library/jest-dom'

if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(
      public url: string,
      public init?: RequestInit
    ) {}
  } as typeof Request
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    public status: number
    public ok: boolean

    constructor(
      public body?: BodyInit | null,
      public init?: ResponseInit
    ) {
      this.status = init?.status ?? 200
      this.ok = this.status >= 200 && this.status < 300
    }

    json(): Promise<unknown> {
      if (typeof this.body === 'string') {
        return Promise.resolve(JSON.parse(this.body) as unknown)
      }
      return Promise.resolve(this.body)
    }

    text(): Promise<string> {
      if (typeof this.body === 'string') {
        return Promise.resolve(this.body)
      }
      return Promise.resolve(this.body == null ? '' : JSON.stringify(this.body))
    }

    clone() {
      return new global.Response(this.body, this.init)
    }
  } as typeof Response
}

if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn(() => Promise.resolve(new Response(null, { status: 200 }))) as typeof fetch
}

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (<T>(value: T) => JSON.parse(JSON.stringify(value)) as T) as typeof structuredClone
}
