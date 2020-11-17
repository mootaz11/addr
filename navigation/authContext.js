import React from 'react';

export default React.createContext({
    darkMode: false,
    user: null,
    token:null,
    historyOrders:[],
    actifOrders:[],
    actifDeliveries:[],
    historyDeliveries:[],
    conversations:[],
    socket:null,
    location:null,
    locationState:false,

}) 
