import React from 'react';
import {Admin} from "react-admin";
import dataProvider from "./dataProvider";
import authProvider from "./authProvider";
import {Resource} from "ra-liac";
import LoginPage from "./components/layout/LoginPage";
import posters from './components/posters';
import clients from './components/clients';

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

export default App;
