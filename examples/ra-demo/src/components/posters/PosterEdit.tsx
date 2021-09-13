import {SimpleForm, TextInput} from "react-admin";
import {Edit} from "ra-liac";

export default props => (
    <Edit {...props}>
        <SimpleForm >
            <TextInput source="name"/>
            <TextInput source="description"/>
            <TextInput source="comment"/>
            <TextInput source="price"/>
        </SimpleForm>
    </Edit>
);