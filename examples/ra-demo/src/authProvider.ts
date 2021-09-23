const permissions = {
    admin: {
        userId: '1',
        userName: 'Jhon Smith',
        permissions: [{actions: '*', resource: '*'}]
    },
    reader: {
        userId: '3',
        userName: 'Izy Rain1',
        permissions: [{resource: '*', actions: 'show'}]
    },
    corrector: {
        userId: '2',
        userName: 'C Corrector',
        permissions: [
            {resource: 'posters', actions: '*,-delete'},
            {resource: 'posters', fields: 'price', actions: '-show'}
        ]
    },
    user: {
        userId: '4',
        userName: 'U User',
        permissions: [
            {resource: 'posters', actions: 'show'},
            {resource: 'posters', records: {id: 2}, actions: 'edit, delete'},
            {resource: 'posters', records: {id: 3}, actions: 'edit'},
            {resource: 'posters', fields: 'comments, price', actions: '-show'},
        ]
    },
}

export default {
    login: ({ username }) => {
        const info = permissions[username];

        if (info) {
            localStorage.setItem('userId', info.userId);
            localStorage.setItem('userName', info.userName);
            localStorage.setItem('permissions', JSON.stringify(info.permissions));
            return Promise.resolve()
        }

        return Promise.reject()
    },
    logout: () => {
        clearUserInfo();
        return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: () => {
        if (localStorage.getItem('userName') && localStorage.getItem('permissions')) {
            return Promise.resolve()
        } else {
            clearUserInfo();
            return Promise.reject();
        }
    },
    getPermissions: () => {
        const perms = localStorage.getItem('permissions')
        return perms ? Promise.resolve(JSON.parse(perms)) : Promise.reject()
    },
    getIdentity: () =>
        Promise.resolve({
            id: localStorage.getItem('userId') ?? '',
            fullName: localStorage.getItem('userName') ?? ''
        }),
};

const clearUserInfo = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('permissions');
}
