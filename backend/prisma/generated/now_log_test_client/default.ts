export type log = {
  log_id: number
  table_name: string | null
  field_name: string | null
  old_value: string | null
  new_value: string | null
  change_date: Date | null
  initials: string | null
}

export class PrismaClient {
  async $disconnect(): Promise<void> {
    return Promise.resolve()
  }
}
