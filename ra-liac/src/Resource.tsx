import {
    Resource, ResourceProps,
} from "ra-core";
import React, {FunctionComponent} from "react";

import useGetCanAccess from "./useGetCanAccess";

const emptyComponent = () => {
    return null
}

const ResourceWithPermission: FunctionComponent<ResourceProps> = (
    {
        edit, list, show, create,
        ...props
    }
) => {
    const canAccess = useGetCanAccess({resource: props.name})
    const routes = {
        list: canAccess({action: 'show'}) ? list : undefined,
        create: canAccess({action: 'create'}) ? create : undefined,
        edit: canAccess({action: 'edit'}) ? edit : undefined,
        show: canAccess({action: 'show'}) ? show : undefined,
    };

    //emptyComponent to handle check on authenticated on starting site
    return (props.intent === 'registration' ? (
        <Resource
            {...routes}
            {...props} />
    ) : (
        <Resource
            {...routes}
            list={routes.list ?? emptyComponent}
            {...props} />
    ));
}

export default ResourceWithPermission