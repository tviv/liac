import {EditButton, List} from "ra-ui-materialui";
import FilterByPermissions from "./utils/FilterByPermissions";
import {
    useRecordContext,
    useResourceContext, useResourceDefinition
} from "ra-core";
import * as React from "react";
import replaceChildren from "./utils/replaceChildren";
import useCanAccess from "./useCanAccess";
const editButtonType = React.createElement(EditButton).type;

const WrappedEditButton = ({children,...props}) => {

    const rd = useResourceDefinition(props)
    const resource = useResourceContext()
    const record = useRecordContext();
    const canEdit = rd.hasEdit && useCanAccess({resource, record, action: 'edit'})

    return canEdit ? (<>{React.cloneElement(children, {...props})}</>) : null
}

export default (props) => {

    //the edit button only if there is permission or hasEdit
    const children = replaceChildren(props.children,
        child=> {
            return typeof child?.type !== 'string' && child.type?.name === editButtonType.name
        },
        child=> props.hasEdit ? (<WrappedEditButton>{child}</WrappedEditButton>) : null
    )

    props = {...props, children}

    return (
        <FilterByPermissions action="show">
            <List {...props} exporter={props.exporter || false} bulkActionButtons={ props.bulkActionButtons || false} />
        </FilterByPermissions>)
}