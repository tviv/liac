import canAccessFactory from "./canAccess";
import convert2ResourcePermissionsDefault, {Permission} from "./convert2NativePermissionsDefault";

const canAccess = canAccessFactory()

describe('canAccess tests - with action and only with resource', () => {
    it('resource, all actions -> same resource, predefined action = allowed', () => {
        const result = canAccess(
            [{resource: 'work places', actions: '*'}],
            {resource: 'work places', action: 'show'}
        )
        expect(result).toEqual(true)
    })
    it('resource, all actions -> other resource, predefined action = denied', () => {
        const result = canAccess(
            [{resource: 'work points', actions: '*'}],
            {resource: 'users', action: 'show'}
        )
        expect(result).toEqual(false)
    })
    it('resource, actions as string with custom action -> same resource, one of allowed action = allowed', () => {
        const result = canAccess(
            [{resource: 'users', actions: 'show, send sms,create'}],
            {resource: 'users', action: 'send sms'}
        )
        expect(result).toEqual(true)
    })
    it('resource, custom action -> same resource, other action = denied', () => {
        const result = canAccess(
            [{resource: 'users', actions: 'send sms'}],
            {resource: 'users', action: 'list'}
        )
        expect(result).toEqual(false)
    })
    it('all resources, all actions -> resource, custom action = allowed', () => {
        const result = canAccess(
            [{resource: '*', actions: '*'}],
            {resource: 'users', action: 'enabled'}
        )
        expect(result).toEqual(true)
    })
    it('all resources, actions as array -> resource, one of allowed actions = allowed', () => {
        const result = canAccess(
            [{resource: '*', actions: ['show', "edit"]}],
            {resource: 'comments', action: 'edit'}
        )
        expect(result).toEqual(true)
    })
})

describe('canAccess tests - with deny actions and only with resource', () => {
    it('resource, all actions denying one -> same resource, predefined allowed action = allowed', () => {
        const result = canAccess(
            [
                {resource: 'plans', actions: '*'},
                {resource: 'plans', actions: 'edit', type:'deny'}
            ],
            {resource: 'plans', action: 'show'}
        )
        expect(result).toEqual(true)
    })
    it('resource, all actions denying one -> same resource, predefined denied action = denied', () => {
        const result = canAccess(
            [
                {resource: 'plans', actions: '*'},
                {resource: 'plans', actions: 'edit', type:'deny'}
            ],
            {resource: 'plans', action: 'edit'}
        )
        expect(result).toEqual(false)
    })
    it('resource, all actions denying one by short form -> same resource, predefined allowed action = allowed', () => {
        const result = canAccess(
            [{resource: 'plans', actions: '*, -edit'}],
            {resource: 'plans', action: 'show'}
        )
        expect(result).toEqual(true)
    })
    it('resource, all actions denying one by short form -> same resource, predefined denied action = denied', () => {
        const result = canAccess(
            [{resource: 'plans', actions: '*, -edit'}],
            {resource: 'plans', action: 'edit'}
        )
        expect(result).toEqual(false)
    })
})

describe('canAccess tests - with fields', () => {
    it('resource, all actions, fields -> same resource, predefined action, allowed field = allowed', () => {
        const result = canAccess(
            [{resource: 'plans', fields: 'unit, count, date', actions: '*'}],
            {resource: 'plans', field: 'unit', action: 'show'}
        )
        expect(result).toEqual(true)
    })
    it('resource, all actions, fields -> same resource, predefined action, not allowed field = denied', () => {
        const result = canAccess(
            [{resource: 'plans', fields: 'unit, count, date', actions: '*'}],
            {resource: 'plans', field: 'amount', action: 'show'}
        )
        expect(result).toEqual(false)
    })
    it('resource, all actions, denied field for one action -> same resource, predefined action, denied field with denied action = denied', () => {
        const result = canAccess(
            [
                {resource: 'plans', fields: '*', actions: '*'},
                {resource: 'plans', fields: 'count', actions: '-edit'}
            ],
            {resource: 'plans', field: 'count', action: 'edit'}
        )
        expect(result).toEqual(false)
    })
    it('resource, all actions, denied field for one action -> same resource, predefined action, denied field with not denied action = allowed', () => {
        const result = canAccess(
            [
                {resource: 'plans', fields: '*', actions: '*'},
                {resource: 'plans', fields: 'count', actions: '-edit'}
            ],
            {resource: 'plans', field: 'count', action: 'show'}
        )
        expect(result).toEqual(true)
    })
    it('resource, some actions, denied field for one action (implicit access for all rest fields) -> same resource, predefined action, denied field with denied action = denied', () => {
        const result = canAccess(
            [
                {resource: 'plans', actions: 'show,edit,create'},
                {resource: 'plans', fields: ['amount', 'count', 'weight'], actions: '-edit'}
            ],
            {resource: 'plans', field: 'count', action: 'edit'}
        )
        expect(result).toEqual(false)
    })
    it('resource, some actions, denied field for one action (implicit access for all rest fields) -> same resource, predefined action, denied field with not denied action = allowed', () => {
        const result = canAccess(
            [
                {resource: 'plans', actions: ['show', 'edit']},
                {resource: 'plans', fields: 'count', actions: ['edit'], type:'deny'}
            ],
            {resource: 'plans', field: 'count', action: 'show'}
        )
        expect(result).toEqual(true)
    })
    it('resource, some actions, denied field for one action (implicit access for all rest fields) -> other resource, predefined action, denied field with not denied action = denied', () => {
        const result = canAccess(
            [
                {resource: 'plans', actions: ['show', 'edit']},
                {resource: 'plans', fields: 'count', actions: ['edit'], type:'deny'}
            ],
            {resource: 'scores', field: 'count', action: 'show'}
        )
        expect(result).toEqual(false)
    })
    it('resource, all actions for all fields, denied one field this action (implicit access for all rest fields)', () => {
        const permissions =
            [
                {resource: 'posters', actions: '*'},
                {resource: 'posters', fields: 'price', actions: '-show'}
            ]
        expect(canAccess(permissions, {resource: 'posters', action: 'show'})).toEqual(true)
        expect(canAccess(permissions, {resource: 'posters', field: 'name', action: 'show'})).toEqual(true)
        expect(canAccess(permissions, {resource: 'posters', field: 'price', action: 'show'})).toEqual(false)
    })
    it('resource, one action for all fields, denied one field this action (implicit access for all rest fields)', () => {
        const permissions =
            [
                {resource: 'posters', actions: 'show'},
                {resource: 'posters', fields: 'price', actions: '-show'}
            ]
        //expect(canAccess(permissions, {resource: 'posters', action: 'show'})).toEqual(true)
        expect(canAccess(permissions, {resource: 'posters', field: 'name', action: 'show'})).toEqual(true)
        //expect(canAccess(permissions, {resource: 'posters', field: 'price', action: 'show'})).toEqual(false)
    })
})
describe('canAccess tests - with records', () => {
    it('resource, all actions, one records -> same resource, predefined action, allowed records = allowed', () => {
        const result = canAccess(
            [{resource: 'comments', records: {userId: 34}, actions: '*'}],
            {resource: 'comments', record: {userId: 34}, action: 'show'}
        )
        expect(result).toEqual(true)
    })
    it('resource, all actions, one records -> same resource, predefined action, not allowed records = denied', () => {
        const result = canAccess(
            [{resource: 'comments', records: [{userId: 34}, {userId: 28}], actions: '*'}],
            {resource: 'comments', record: {userId: 23}, action: 'show'}
        )
        expect(result).toEqual(false)
    })
})

describe('canAccess tests - request access as scope', () => { //scopes are liked resources only without fields, records, and action has only one value = 'enabled'
    it('resource, all actions, one records -> same resource, predefined action, allowed records = allowed', () => {
        const permissions = [{resource: 'send sms', actions: 'enabled'}]
        expect(canAccess(permissions,{scope: 'send sms'})).toEqual(true)
        expect(canAccess(permissions,{scope: 'delete public key'})).toEqual(false)
    })
})

describe('canAccess tests - other kinds of permissions parameter', () => {
    it('permissions is undefined = denied', () => {
        const result = canAccess(
            undefined,
            {resource: 'comments', action: 'show'}
        )
        expect(result).toEqual(false)
    })
    it('permissions is in normalised view as sub resource (NativePermissions)', () => {
        const permissions = {allow:{ edit: { fields: [ 'id', 'name' ] }, '*': {} }}
        //resource name fot that case is not important
        expect(canAccess(permissions,{resource: 'comments', field: 'name', action: 'edit'})).toEqual(true)
        expect(canAccess(permissions,{resource: 'users', field: 'birthday', action: 'edit'})).toEqual(false)
    })
    it('permissions is in normalised view (with resources NativePermissionsMap)', () => {
        const permissions = new Map([['comments', {allow:{ edit: {}, show: {} }}], ['users', {allow:{ show: {} }}]])
        //resource name fot that case is important
        expect(canAccess(permissions,{resource: 'comments', action: 'edit'})).toEqual(true)
        expect(canAccess(permissions,{resource: 'users', action: 'edit'})).toEqual(false)
        expect(canAccess(permissions,{resource: 'users', action: 'show'})).toEqual(true)
    })
})