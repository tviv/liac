import fakeDataProvider from 'ra-data-fakerest';

const _default = fakeDataProvider({
    posters: [
        { id: 1, name: 'Poster-23', description: 'description of poster 23', comment: 'it\'s good', price: 100 },
        { id: 2, name: 'Poster-67', description: 'description of poster 67', comment: 'weak', price: 130  },
        { id: 3, name: 'Poster-67', description: 'description of poster 67', comment: 'hire its author', price: 80  },
    ],
    clients: [
        { id: 0, name: 'client 1' },
        { id: 1, name: 'client 2' },
        { id: 3, name: 'client 3' },
    ]

});

export default _default;