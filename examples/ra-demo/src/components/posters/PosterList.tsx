import * as React from "react";
import {EditButton, ListProps, ShowButton, TextField, Datagrid, SimpleList} from "react-admin";

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