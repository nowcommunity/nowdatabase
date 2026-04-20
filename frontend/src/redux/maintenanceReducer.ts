import { api } from '@/redux/api'

export type MaintenanceState = {
  enabled: boolean
  enabledAt: string | null
  reason: string | null
  enabledBy: string | null
}

export type DisableMaintenanceResponse = MaintenanceState & {
  disabledBy: string | null
  previouslyEnabledAt: string | null
}

const maintenanceApi = api.injectEndpoints({
  endpoints: builder => ({
    getMaintenanceState: builder.query<MaintenanceState, void>({
      query: () => ({ url: '/admin/maintenance', method: 'GET' }),
    }),
    enableMaintenanceMode: builder.mutation<MaintenanceState, { reason?: string }>({
      query: ({ reason }) => ({
        url: '/admin/maintenance/enable',
        method: 'POST',
        body: { reason },
      }),
    }),
    disableMaintenanceMode: builder.mutation<DisableMaintenanceResponse, void>({
      query: () => ({
        url: '/admin/maintenance/disable',
        method: 'POST',
      }),
    }),
  }),
})

export const { useGetMaintenanceStateQuery, useEnableMaintenanceModeMutation, useDisableMaintenanceModeMutation } =
  maintenanceApi
