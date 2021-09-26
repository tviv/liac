# liac
Light Access Control for js projects. It was heavily inspired by [ra-auth-acl](https://github.com/marmelab/ra-auth-acl) and [ra-access-control-lists] (https://github.com/andrico1234/ra-access-control-lists).

Check out [demo](https://tviv.github.io/ra-demo) with using the react-admin framework.

## Installation

Liac is available from npm. You can install it using:

```sh
npm install liac
#or
yarn add liac
```
## Usage
You should have array of permissions:
```typescript
[{ resource: string, fields?: string | string[], records?: object | object[], actions: string | string[], type?: 'allow' | 'deny' },...]
```

Like this:
```typescript
const permissions = [
    {resource: 'posts', actions: 'show'},
    {resource: 'posts', records: {userId: 4}, actions: 'edit, delete'},
    {resource: 'posts', records: {userId: 6}, actions: 'edit'},
    {resource: 'posts', fields: 'comments, rating', actions: '-show'},
]
```
Where:
- resource - an entity/resource that we impose a restriction on. It is a string.
- actions are actions, comma separated (or as an array) which you want to allow an user or deny if you added pefix "-" to action (e.g. "-show" - denies show). By the way, instead of "-" you can use property "type" in the 'deny" value (type: 'deny').
  As it was mentioned, you can use any actions but the author prefferes the following "create", "show", "edit", "delete" (similar CRUD).
- fields are "horizontal" scope of resource, represented as an enumeration of the names of the resource fields separated by a comma (or as an array). For fields only actions "show" and "edit" are valid. More over if you have "deny" for show it will be default "deny" and for "edit" action.

- records are "vertical" scope of resource. It is object (or object array) with properties to set as filter (using the lodash.isMatch function). Of course first of all the backend should deal with this.

Also for resources and actions you can use "*" sign, what means any possible values. For example, for an admin user you might use the next permissions:
```typescript
const permissions = [{resource: '*', actions: '*'}]
```

By the way, you can use your permission representation completely by rewriting the conversion function to the internal view (the description of the internal view of permissions is outside this guide)
The library has the (main) function "canAccess" taking two parameters:
- array of permissions, described above (you can also pass inner liac representation to skip parsing, if, for example, you  have any cache for this)
- an object for which permission is requested.

The second parameters has the next representation:
```typescript
{resource: string, field?: string, record?: object, action: string}
```
For permissions from the first example earlier, the "canAccess" might have the following results:
```javascript
canAccess(permissions, {resource: 'posts', action:'show'}) //returns 'true'
canAccess(permissions, {resource: 'users', action:'show'}) //returns 'false'
```
By the way, shorthand form can be like ({scope: string, action: string}).

In this library, access is granted based on permissions. There is no difficulty in using this in the role model (RBAC), because the basis remains the same.
## Other library where liac is used
### ra-liac
Framework for [react-admin] (https://marmelab.com/react-admin) to manage basic views access based on pre-defined permissions ([live demo](https://tviv.github.io/ra-demo)).

#### Getting Started
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

####Hooks
You might make your own checks on access with help by hooks **useCanAccess** and **useGetCanAccess**.

**useCanAccess** returns true if you can access to some scope for specify action (parameter is the object with properties: resource, record, field, action, where record and field is optional)example:
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