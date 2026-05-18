import 'material-react-table'

declare module 'material-react-table' {
  export const getLastMaterialReactTableOptions: <T = unknown>() => T | null
}

export {}
