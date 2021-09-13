import {Show} from "ra-ui-materialui";
import FilterByPermissions from "./utils/FilterByPermissions";

/*
const ShowWithPermissions = (({children,...props}: ShowProps & { children: ReactElement }) => {

    console.log('swp', children)
    const filteredChildren = React.Children.toArray(children.props.children).filter((child) => {
        console.log('fc', children)
        // @ts-ignore
        const source = child.props?.source
        //console.log(child.props?.resource)
        return !source || (source &&
            useCanAccess({resource: props.resource ?? '', field: source, action: 'show'}));
    });

    //const
    //const ch = {...children,...}

    //console.dir(props.children)
    return (<Show {...props} >{React.cloneElement(children, {...children.props, children: filteredChildren})}</Show>)

})
*/

export default props => (<FilterByPermissions action="show"><Show {...props}/></FilterByPermissions>)