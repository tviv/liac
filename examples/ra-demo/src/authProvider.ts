export default {
    login: ({ username }) => {
        let info;
        switch (username) {
            case 'admin':
                info = {
                    userId: '1',
                    userName: 'Jhon Smith',
                    role: 'admin',
                    permissions: [{actions: '*', resource: '*'}]
                }
                break;

            case 'corrector':
                info = {
                    userId: '2',
                    userName: 'C Corrector',
                    role: 'corrector',
                    permissions: [
                        {resource: 'posters', actions: '*,-delete'},
                        {resource: 'posters', fields: 'price', actions: '-show'}
                    ]
                }
                break;

            case 'reader':
                info = {
                    userId: '3',
                    userName: 'Izy Rain1',
                    role: 'reader',
                    permissions: [{resource: '*', actions: 'show'}]
                }
                break;
            case 'user':
                info = {
                    userId: '4',
                    userName: 'U User',
                    role: 'user',
                    permissions: [
                        {resource: 'posters', actions: 'show'},
                        {resource: 'posters', fields: 'price', actions: '-show'},
                    ]
                }
                break;
        }

        if (info) {
            localStorage.setItem('userId', info.userId);
            localStorage.setItem('userName', info.userName);
            localStorage.setItem('role', info.role);
            localStorage.setItem('permissions', JSON.stringify(info.permissions));
            return Promise.resolve()
        }

        return Promise.reject()
    },
    logout: () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: () =>
        localStorage.getItem('userName') ? Promise.resolve() : Promise.reject(),
    getPermissions: () => Promise.resolve(JSON.parse(localStorage.getItem('permissions') || '[]')),
    getIdentity: () =>
        Promise.resolve({
            id: localStorage.getItem('userId') ?? '',
            fullName: localStorage.getItem('userName') ?? ''
        }),
};
