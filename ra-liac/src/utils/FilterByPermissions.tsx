import filterChildren from "./filterChildren";
import useCanAccess from "../useCanAccess";
import React, {ReactElement} from "react";


const FilterByPermissions = ({children, action}: {action: string, children: ReactElement}) => {

    const resource = children?.props?.resource ?? ''
    const filteredChildren = filterChildren(children, child => {
        const source = child.props?.source
        let requestAccess = source && {resource: resource, field: source, action: action};
        // @ts-ignore
        requestAccess = requestAccess || !requestAccess && child?.type?.name === 'EditButton' && {resource: resource, action: 'edit'}

        return useCanAccess(requestAccess)
    })

    return (<>{filteredChildren}</>)
}

export default FilterByPermissions