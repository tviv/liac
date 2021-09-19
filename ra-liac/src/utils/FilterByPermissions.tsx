import filterChildren from "./filterChildren";
import React, {ReactElement} from "react";
import useGetCanAccess from "../useGetCanAccess";


const FilterByPermissions = ({children, action}: {action: string, children: ReactElement}) => {
    const canAccess = useGetCanAccess(children?.props)

    const filteredChildren = filterChildren(children, child => {

        const source = child.props?.source
        let requestAccess = source && {field: source,  action: action};

        // requestAccess = requestAccess ||
        //     // @ts-ignore
        //     child?.type?.name === 'EditButton' && {resource: resource, action: 'edit'}

        // @ts-ignore
        if (child?.type?.name === 'EditButton' && !children.props?.hasEdit) return false

        return !!canAccess(requestAccess)
    })

    return (<>{filteredChildren}</>)
}

export default FilterByPermissions