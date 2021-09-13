import {Action, FIELD_ACTIONS, PermissionType, NativePermissions, NativePermissionScope} from "./NativePermissions";

export type Permission = {
    resource: string,
    records?: object[] | object
    fields?: string[] | string
    actions: Array<Action | '*'> | string,
    type?: PermissionType //by default allow (deny can be repleaced by adding "-" symbol at beginning of action in actions
}


export default (resource: string, permissions: Permission[]): NativePermissions => {
    const normalizeByType = function (
        type: PermissionType,
        filteredPermissions: { fields?: string[], actions: string[], records?: object[], type?: PermissionType }[]
    ): NativePermissions {
        const filtered = filteredPermissions.filter(x => x.type === type)

        const actions = filtered.flatMap(x => x.actions).filter((v, i, a) => a.indexOf(v) === i)

        const result = Object.fromEntries(new Map(actions.map(x => [x, <NativePermissionScope>{}])))

        actions.filter(x => FIELD_ACTIONS.includes(x) || x === '*').forEach(x => {
            const fields = filtered.filter(v => v.fields && v.actions.includes(x)).flatMap(v => v.fields) as string[]
            if (fields.length) result[x].fields = fields
        })

        actions.forEach(x => {
            const records = filtered.filter(v => v.records && v.actions.includes(x)).flatMap(v => v.records as object[])
            if (records.length) result[x].records = records
        })

        addImpliedLogicAsExplicit(type, result)

        return Object.entries(result).length ? {[type]: result} : {}
    }

    const filteredByResourceAndStringsAsArrays = permissions
        .filter(x => x.resource === resource || x.resource === '*')
        .map(x => ({
            ...x, actions: typeof x.actions === 'string'
                ? x.actions.split(',').map(v => v.trim()).filter(v => v !== '') //the first operation .replace('*', ACTIONS) was removed for more fluent
                : x.actions || []
        }))
        .flatMap(x => {
            const res = [ //add type "allow" explicitly
                {...x, type: x.type || 'allow', actions: x.actions.filter(x => !x.startsWith('-'))}
            ]
            //sugar - if there are action with minus at the beginning, convert them to normal view
            const denyActions = x.actions.filter(x => x.startsWith('-')).map(x => x.substring(1))
            if (denyActions.length) res.push({...x, type: 'deny' as PermissionType, actions: denyActions})
            return res
        })
        .map(x => ({
            ...x, fields: typeof x.fields === 'string'
                ? x.fields.replace('*', '').split(',').map(v => v.trim()).filter(v => v !== '') //remove "*" so it all is implicit access for fields
                : x.fields
        }))
        .map(x => ({...x, records: !x.records ? [] : Array.isArray(x.records) ? x.records : [x.records]}))


    const allowed = normalizeByType('allow', filteredByResourceAndStringsAsArrays)
    const denied = normalizeByType('deny', filteredByResourceAndStringsAsArrays)


    return {...allowed, ...denied};
}

//helpers
/**
 * Post handling (few business logic) - if "show" is restricted but "edit" is not done explicitly  then we must restrict edit
 * othewise it is illogical if "show" doesn't allow but "edit" allows everything...and etc
 * @param type
 * @param permissionScope
 */
const addImpliedLogicAsExplicit = (type: PermissionType, permissionScope: {[key in Action | string]?: NativePermissionScope}) => {
    const result = permissionScope
    const considerAllActions = (result['*'] && type === "allow") || (!result['*'] && type === "deny")
    if (result.edit || considerAllActions) {
        if (result.show?.fields && !result.edit?.fields) {
            if (!result.edit) result.edit = {}
            result.edit.fields = result.show.fields
        }
        if (result.show?.records && !result.edit?.records) {
            if (!result.edit) result.edit = {}
            result.edit.records = result.show.records
        }
    }
    if (result.delete || result['*']) {
        if (result.edit?.records && !result.delete?.records) {
            if (!result.delete) result.delete = {}
            result.delete.records = result.edit.records
        }
    }
}
//const ACTIONS = Array.from(new Set([...actionWithRecords,...actionWithFields])).join(',')



