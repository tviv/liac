import {EditView} from "ra-ui-materialui";
import FilterByPermissions from "./utils/FilterByPermissions";
import Toolbar from "./Toolbar";
import {EditContextProvider, useCheckMinimumRequiredProps, useEditController,useRedirect} from "ra-core";
import * as React from "react";
import useCanAccess from "./useCanAccess";


export default props => {

    // let  injectedChildren = children
    if (props.children?.type?.name === 'SimpleForm') {
        const toolbar = props.children.toolbar || (<Toolbar/>)
        let children = {...props.children, props: {...props.children.props, toolbar}}
        props = {...props, children}
    }

    useCheckMinimumRequiredProps('Edit', ['children'], props);
    const controllerProps = useEditController(props);

    const redirect = useRedirect();
    const canEdit = useCanAccess(
        {resource: controllerProps.resource, record: controllerProps.record, action: 'edit'})

    if (!canEdit) {
        // noinspection PointlessBooleanExpressionJS
        if (canEdit === false) redirect('list', props.basePath);
        return null
    }
    return (
        <EditContextProvider value={controllerProps}>
            <FilterByPermissions action="edit">
                <EditView {...props} {...controllerProps} />
            </FilterByPermissions>
        </EditContextProvider>
    );
}