export type log = {
  log_id: number
  table_name: string | null
  column_name: string | null
  old_data: string | null
  new_data: string | null
  log_action: number | null
  change_date: Date | null
  initials: string | null
}

export class PrismaClient {
  async $disconnect(): Promise<void> {
    return Promise.resolve()
  }
}
