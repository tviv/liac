import {PermissionType, NativePermissions, NativePermissionsMap} from "./NativePermissions";
import convert2ResourcePermissionsDefault from "./convert2NativePermissionsDefault";

const isMatch = require('lodash.ismatch')

type RequestedAccessAsResource = {resource: string, field?: string, record?:object, action: string}
type RequestedAccessAsScope = {scope: string}

export type RequestedAccess = RequestedAccessAsResource  | RequestedAccessAsScope

const checkRules: {whereName:'fields' | 'records', whatName: 'field' | 'record', fn: (o:any[], v:any)=>boolean}[] = [
    {whereName: 'fields', whatName: 'field', fn: (o: string[], v: string) => o?.includes(v)},
    {whereName: 'records', whatName: 'record', fn: (o: object[], v: object) => o?.some(x => isMatch(v, x))}
]

export default (castAppPerms2NativePerms: (resource: string, source: any) => NativePermissions
                    = convert2ResourcePermissionsDefault) => {
    // noinspection UnnecessaryLocalVariableJS
    const canAccess = (
        permissions: any | NativePermissions | NativePermissionsMap | undefined,
        requestedAccess: RequestedAccess
    ): boolean => {
        if (!permissions) return false

        const ra: {resource: string, field?: string, record?:object, action: string} = requestedAccess.hasOwnProperty('scope')
            ? {resource: (requestedAccess as {scope: string}).scope, action: 'enabled'} : requestedAccess as RequestedAccessAsResource

        const resource = ra.resource
        if (!resource || !resource.length) return false

        const np: NativePermissions =
            (permissions instanceof Map)
                ? (permissions as NativePermissionsMap).get(resource)
                : (permissions.hasOwnProperty('allow') || permissions.hasOwnProperty('deny')
                    ? permissions : castAppPerms2NativePerms(resource, permissions))

        const checkScopes = function (type: PermissionType): boolean {
            const and = type === 'allow'
            let checkScopesResults: (boolean | undefined)[] = []

            let actionContent = np[type] && (np[type]![ra.action] || np[type]!['*'])
            //const actionsWithContent = [np[type] && np[type]![ra.action], np[type] && np[type]!['*']]
            //actionsWithContent.forEach(actionContent => {
                if (actionContent) {
                    const ac = actionContent

                    checkRules.forEach(x => {
                        if (!and) checkScopesResults.push(ac[x.whereName] && !ra[x.whatName] ? false : undefined)
                        checkScopesResults.push(ac[x.whereName] && ra[x.whatName]
                            ? x.fn(ac[x.whereName] as any[], ra[x.whatName]) : undefined)
                    })
                    /*
                                    if (!and) checkScopesResults.push(actionContent.fields && !ra.field ? false : undefined)
                                    checkScopesResults.push(actionContent.fields && ra.field
                                        ? actionContent.fields?.includes(ra.field) : undefined)
                                    checkScopesResults.push(actionContent.records && ra.record
                                        ? actionContent.records.every(x => isMatch(ra.record, x)) : undefined)
                                        */
                }
            //})

            let checkScopesResult = checkScopesResults.filter(x=> x !== undefined).reduce((a: boolean|undefined, x) => {
                //const v = x === undefined ? and : x
                if (a === undefined) a = x

                return and ? a && x : a || x
            }, undefined)

            return !!actionContent && checkScopesResult !== false
            //return actionsWithContent.some(x=>x) && checkScopesResult !== false
        }

        const denied = checkScopes('deny')

        return !denied && checkScopes('allow');
    }

    return canAccess
}