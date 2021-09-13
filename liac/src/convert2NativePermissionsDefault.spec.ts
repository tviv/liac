import convert2NativePermissionsDefault, {Permission} from "./convert2NativePermissionsDefault";

describe('test normalizing function', () => {
    it('without resource *', () => {

        const resource = 'posts'
        const result = convert2NativePermissionsDefault(resource, permissions1 as Permission[])
        //console.dir(result)
        expect(result).toEqual(
            {
                allow: {
                        "create": {},
                        "delete": {
                            "records": [{
                                "shop": 21
                            }, {
                                "shop": 45
                            }]
                        },
                        "edit": {
                            "fields": ["name", "description"],
                            "records": [{
                                "categoryId": 34
                            }, {
                                "shop": 21
                            }, {
                                "shop": 45
                            }]                        },
                        "show": {
                            "fields": ["name", "description", "stocks", "total"],
                            "records": [{
                                "categoryId": 34
                            }, {
                                "shop": 21
                            }, {
                                "shop": 45
                            }]
                        }
                    }
            }
        )
    })
    it('with resource *', () => {
        const result = convert2NativePermissionsDefault('users', permissions2)
        //console.dir(result)
        expect(result).toEqual({allow: { list: {}, edit: {fields: [ 'id', 'name' ]}, show: { fields: [ 'id', 'name' ] } }})
    })

    it('with resource *, and only show', () => {
        const result = convert2NativePermissionsDefault('users', [
            {resource: '*', actions: 'list,show'},
            {resource: 'users', fields: 'id, name', actions: 'show'},
        ])
        expect(result).toEqual({allow: { list: {}, show: { fields: [ 'id', 'name' ] } }})
    })

    it('with resource *, all actions and and deny only show', () => {
        const result = convert2NativePermissionsDefault('users', [
            {resource: '*', actions: '*'},
            {resource: 'users', fields: 'id, name', actions: '-show'},
        ])
        expect(result).toEqual({allow: {'*':{}}, deny: { show: { fields: [ 'id', 'name' ] }, edit: { fields: [ 'id', 'name' ] } }})
    })

    it('with resource * and actions *', () => {
        const result = convert2NativePermissionsDefault('users', permissions3)
        //console.dir(result)
        expect(result).toEqual({allow:{ show: { fields: [ 'id', 'name' ] }, edit: { fields: [ 'id', 'name' ] }, '*': {} }})
    })

    it('with resource * and actions * and deny one action via "-"', () => {
        const result = convert2NativePermissionsDefault('users', permissions4)
        //console.dir(result)
        expect(result).toEqual({allow:{ show: { fields: [ 'id', 'name' ] }, edit: { fields: [ 'id', 'name' ] }, '*': {} }, deny: {delete: {}}})
    })
})

const permissions1 = [
    {resource: 'posts', actions: 'create,delete'},
    {resource: 'posts', fields: ['name', 'description'], actions: ['edit', 'show', 'delete']}, //delete will be ignored for fields
    {resource: 'posts', fields: 'stocks, total', actions: ['show']},
    {resource: 'posts', records: {categoryId: 34}, actions: ['show']},
    {resource: 'posts', records: [{shop: 21}, {shop: 45}], actions: ['show', 'delete']},
    {resource: 'users', fields: 'id, name', actions: 'create,edit,show'},
]

const permissions2 = [
    {resource: '*', actions: 'list,edit,show'},
    {resource: 'users', fields: 'id, name', actions: 'show'},
]

const permissions3 = [
    {resource: '*', actions: '*'},
    {resource: 'users', fields: 'id, name', actions: 'show'},
]

const permissions4 = [
    {resource: '*', actions: '*, -delete'},
    {resource: 'users', fields: 'id, name', actions: 'show'},
]