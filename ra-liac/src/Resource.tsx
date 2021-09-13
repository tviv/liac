import {Resource, ResourceProps} from "ra-core";
import React from "react";
import FilterByPermissions from "./utils/FilterByPermissions";
import useCanAccess from "./useCanAccess";
const ResourceWithPermission = ({name: resourceName, edit, list, show, create, ...props}:ResourceProps) => {

    const access = {
        list: useCanAccess({action: 'show', resource: resourceName}),
        create: useCanAccess({action: 'create', resource: `${resourceName}`}),
        edit: useCanAccess({action: 'edit', resource: `${resourceName}`}),
        show: useCanAccess({action: 'show', resource: `${resourceName}`}),
    };




    return (
        <Resource
            name={resourceName}
            list={access.list ? list : undefined}
            edit={access.edit ? edit : undefined}
            show={access.show ? show: undefined}
            create={access.create ? create : undefined}

            {...props}/>
    )
}

export default ResourceWithPermission