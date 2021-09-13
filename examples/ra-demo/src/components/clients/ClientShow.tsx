import {Edit, ListProps, ShowProps, SimpleForm, SimpleShowLayout, TextField, TextInput} from "react-admin";
import {EditProps} from "ra-ui-materialui/src/types";
import {Show} from "ra-liac";

export default (props: ShowProps) => {

    return (<Show {...props}>
            <SimpleShowLayout>
                <TextField  source="name"/>
            </SimpleShowLayout>
        </Show>
    )
};