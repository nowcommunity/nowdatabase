import express from 'express'

export type Middleware = (req: express.Request, _res: express.Response, next: express.NextFunction) => void

export enum Role {
  Admin,
  EditUnrestricted,
  EditRestricted,
  NowOffice,
  Project,
  ProjectPrivate,
  ReadOnly,
}

export type User = {
  username: string
  role: Role
  userId: number
  initials: string
}

// Administrator su
// Edit unrestricted eu
// Edit restricted er
// NOW office no
// Project worker pl
