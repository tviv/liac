import {ShowView} from "ra-ui-materialui";
import FilterByPermissions from "./utils/FilterByPermissions";
import {ShowContextProvider, useCheckMinimumRequiredProps, useRedirect, useShowController} from "ra-core";

import useGetCanAccess from "./useGetCanAccess";

const ShowWithPermissions = props => {
    useCheckMinimumRequiredProps('Show', ['children'], props);
    const redirect = useRedirect();
    const controllerProps = useShowController(props);
    const canAccess = useGetCanAccess(props)

    const canShow = canAccess({record: controllerProps.record, action: 'show'})
    if (!canShow) {
        if (canShow === false) redirect('list', props.basePath);
        return null
    }

    controllerProps.hasEdit = controllerProps.hasEdit &&
        canAccess({record: controllerProps.record, action: 'edit'})

    return (
        <ShowContextProvider value={controllerProps}>
            <FilterByPermissions action="show">
            <ShowView {...props} {...controllerProps} />
            </FilterByPermissions>
        </ShowContextProvider>
    );
}

export default ShowWithPermissions