import {Create} from "ra-ui-materialui";
import FilterByPermissions from "./utils/FilterByPermissions";

export default props => (<FilterByPermissions action="edit"><Create {...props}/></FilterByPermissions>)