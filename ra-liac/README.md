## ra-liac
Framework for [react-admin] (https://marmelab.com/react-admin) to manage basic views access based on pre-defined permissions ([live demo](https://tviv.github.io/ra-demo)).

### Getting Started
ra-liac is available from npm.
You can install it using:
```sh
npm install ra-liac
#or
yarn add ra-liac
```

yours authProvider's getPermission method has to return permissions understandable to the liac library, like this:
```javascript
const authProvider = {
  //...
  getPermissions: () => {
    return Promise.resolve(
        [{resource: 'users', records: {id:32}, action: 'show,edit'}])
  }
}
```
learn more detail about permission format [here](https://github.com/tviv/liac/tree/master/liac)

ra-liac uses the next actions:
- "create" for List view (to hide/show the original CreateButton)
- "show" for List and Show view
- "edit" for Edit view and List (to hide/show the original EditButton),
- "delete" for Edit view (to hide/show the original DeleteButton)

If you will use the Resource, List (with Datagrid inside), Show, Edit tsx-views from ra-liac they will be checked by liac and what allowed and not denied will be only displayed.

Example for Resource:
```javascript
import {Resource} from "ra-liac";

const App = () =>  (
    <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={LoginPage}
    >
        <Resource name="posters" {...posters} />
        <Resource name="clients" {...clients} />
    </Admin>
);
```
For List:
```javascript
import {List} from "ra-liac";

export default props => (
    <List {...props}>
        <Datagrid rowClick="show">
            <TextField source="id"/>
            <TextField source="name"/>
            <TextField source="description"/>
            <TextField source="price"/>
            <EditButton label=""/>
        </Datagrid>
    </List>
);
```
Here, if there is restriction for records then the list won't be filtered (it can be done, but it is the responsibility of the backend), but you won't be able to open Show/Edit detail forms for not allowed records (If there is EditButton on form it will be hidden).
Only the allowed fields will be shown.
For Show:
```javascript
import {Show} from "ra-liac";

export default props => (
        <Show {...props}>
          <SimpleShowLayout>
            <TextField  source="name"/>
            <TextField  source="description"/>
            <TextField source="comment"/>
            <TextField  source="price"/>
          </SimpleShowLayout>
        </Show>
)
```
If an user has access to show this record it will be opened, othewise will be redirected to the List page.
If the "edit" action is allowed the EditButton will be presented.
Only the allowed fields will be shown.

The same for Edit view. Only with one exception - by default Edit has DeleteButton, and if there is not granted "delete" permission the button will be removed from the form.

###Hooks
You might make your own checks on access with help by hooks **useCanAccess** and **useGetCanAccess**.

**useCanAccess** (preferred) returns true if you can access to some scope for specify action (parameter is the object with properties: resource, record, field, action, where record and field is optional)example:
 ```typescript
const canDelete = useCanAccess({record, resource, action: 'delete'})
```
**useGetCanAccess** takes object with resource and permissions poroperties, but in not mandatory because in that case they will be obtained by react-admin hooks and  returns the function canAccess.
The resulting canAccess function has the same parameter as useCanAccess, excluding that "resource" has not sense here - it is already clousured.  It returns true/false if access is checked and undefined if loading is in process.

example:
 ```javascript
const canAccess = useGetCanAccess(props)

const canShow = canAccess({field: 'price', record, action: 'show'})
```