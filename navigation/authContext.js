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
    notSeenConversations:[],
    seenConversations:[]

}) 
