import {List, Show} from "ra-ui-materialui";
import FilterByPermissions from "./utils/FilterByPermissions";

export default props => (<FilterByPermissions action="show"><List {...props}/></FilterByPermissions>)