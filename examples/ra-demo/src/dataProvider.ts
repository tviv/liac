import fakeDataProvider from 'ra-data-fakerest';

const _default = fakeDataProvider({
    posters: [
        { id: 1, name: 'Poster-23', description: 'description of poster 23', comment: 'it\'s good', price: 100 },
        { id: 2, name: 'Poster-67', description: 'description of poster 67', comment: 'weak', price: 130  },
        { id: 3, name: 'Poster-24', description: 'description of poster 24', comment: 'hire its author', price: 80  },
        { id: 4, name: 'Poster-98', description: 'description of poster 98', comment: 'hire its author', price: 23  },
        { id: 5, name: 'Poster-298', description: 'description of poster 298', comment: 'hire its author', price: 340  },
        { id: 6, name: 'Poster-11', description: 'description of poster 11', comment: 'hire its author', price: 54  },
    ],
    clients: [
        { id: 1, name: 'client 1' },
        { id: 2, name: 'client 2' },
        { id: 3, name: 'client 3' },
        { id: 4, name: 'client 4' },
    ]

});

export default _default;