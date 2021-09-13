const actionWithRecords = ['create', 'show', 'edit', 'delete'] as const //it can be deleted
const actionWithFields = ['show', 'edit'] as const

export type Action =  typeof actionWithRecords[number] | typeof actionWithFields[number]; // | 'exec';
export type PermissionType = 'allow' | 'deny'
export type NativePermissionScope = {
    fields?: string[],
    records?: object[]
}

export type NativePermissions = {
    [key in PermissionType]?: {
    [key in Action | string]?: NativePermissionScope
} | undefined
}

export type NativePermissionsMap = Map<string, NativePermissions>
export const FIELD_ACTIONS = actionWithFields.join(',')