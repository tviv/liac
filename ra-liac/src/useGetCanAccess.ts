import {usePermissions, useResourceContext} from "ra-core";
import {useCallback} from "react";
import {RequestedAccess, canAccessFactory } from "liac";
const canAccess = canAccessFactory()

const useGetCanAccess =<T extends { resource?: string, permissions?: any }>(props?: T) => {

    let {loaded, permissions} = usePermissions();
    const resource = useResourceContext(props)

    if (props && props.permissions) {
        permissions = props.permissions
        loaded = true
    }

    return useCallback(
        (askedPermission: Partial<RequestedAccess> | undefined) => {
            // @ts-ignore
            const ap = askedPermission && !askedPermission.scope && !askedPermission.resource
                ? {...askedPermission, resource} : askedPermission
            // @ts-ignore
            return !ap || (loaded ? canAccess(permissions, ap) : undefined)
        },
        [permissions])
};

export default useGetCanAccess;