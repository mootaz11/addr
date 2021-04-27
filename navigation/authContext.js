import React from 'react';

export default React.createContext({
    darkMode: false,
    user: null,
    token:null,
    conversations:[],
    socket:null,
    location:null,
    deliveryData:null,
    locationState:false,
    loggedIn:false,
    bag:0,
    total:0,
    notifications:[],
}) 
