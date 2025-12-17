// Polyfill for React Router's data router in Jest environment
// See: https://github.com/remix-run/react-router/discussions/9851
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(public url: string, public init?: RequestInit) {}
  } as typeof Request
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(public body?: BodyInit | null, public init?: ResponseInit) {}
  } as typeof Response
}
