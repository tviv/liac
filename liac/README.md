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

P.S. Other library where liac is used: [ra-liac](https://github.com/tviv/liac/tree/master/ra-liac)