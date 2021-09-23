import * as React from "react";
import {TextField, Datagrid, EditButton} from "react-admin";

import {PostListActionToolbar} from "ra-liac";
import {List} from "ra-liac";

export default props => (
    <List {...props}>
        <Datagrid rowClick="show">
            <TextField source="id"/>
            <TextField source="name"/>
            <TextField source="description"/>
            <TextField source="price"/>
            <PostListActionToolbar>
                <EditButton label=""/>
            </PostListActionToolbar>
        </Datagrid>
    </List>
);