import {SimpleForm, TextInput} from "react-admin";
import {Edit} from "ra-liac";

export default props => (
    <Edit {...props}>
        <SimpleForm >
            <TextInput source="name"/>
        </SimpleForm>
    </Edit>
);