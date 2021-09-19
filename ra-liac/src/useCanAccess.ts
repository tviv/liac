import {useMemo} from "react";
import {RequestedAccess} from "liac";
import useGetCanAccess from "./useGetCanAccess";

const useCanAccess = (askedPermission: RequestedAccess | undefined) => {

    const canAccess = useGetCanAccess()

    return useMemo(
        () => canAccess && canAccess(askedPermission),
        [canAccess, askedPermission])
};

export default useCanAccess;