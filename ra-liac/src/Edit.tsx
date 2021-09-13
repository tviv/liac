import {Edit} from "ra-ui-materialui";
import FilterByPermissions from "./utils/FilterByPermissions";
import Toolbar from "./Toolbar";

export default ({children, ...props}) => {

    let  injectedChildren = children
    if (children.type.name === 'SimpleForm') {
        const toolbar = children.toolbar || (<Toolbar/>)
        injectedChildren = {...children, props: {...children.props, toolbar}}
    }
    return (
    <FilterByPermissions action="edit">
        <Edit {...props} children={injectedChildren}/>
    </FilterByPermissions>
    )
}