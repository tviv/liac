import {SimpleForm, TextInput} from "react-admin";
import {Create} from "ra-liac";

export default props => (
     <Create {...props}>
            <SimpleForm>
                <TextInput  source="name"/>
                <TextInput  source="description"/>
                <TextInput source="comment"/>
                <TextInput  source="price"/>
            </SimpleForm>
        </Create>
    );