import {usePermissions} from "ra-core";
import {useMemo} from "react";
import {RequestedAccess, canAccessFactory } from "liac";
const canAccess = canAccessFactory()

const useCanAccess = (askedPermission: RequestedAccess | undefined) => {

    const {permissions} = usePermissions();

    return useMemo(
        () => {
            return !askedPermission || canAccess(permissions, askedPermission)
        },
        [permissions, askedPermission])
};

export default useCanAccess;