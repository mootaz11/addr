//import AsyncStorage from '@react-native-community/async-storage'

const getToken = async (item) => {
  let token = '';
  try {
    token = await AsyncStorage.getItem(item) || 'none';
  } catch (error) {
    console.log(error.message);
  }
  return token;
}

  
  
  
  const AsyncStorageService = (function () {
    var _service;
    function _getService() {
        if (!_service) {
            _service = this;
            return _service
        }
        return _service
    }
     function _setToken(tokenObj) {
      // await  AsyncStorage.setItem('access_token', tokenObj.accessToken);
      // await  AsyncStorage.setItem('refresh_token', tokenObj.refreshToken);
      localStorage.setItem('access_token',tokenObj.accessToken)
      localStorage.setItem('refresh_token', tokenObj.refreshToken);
      
    }

    
      function _getAccessToken() {
      return    localStorage.getItem('access_token')//getToken('access_token')
   
    }
     function _getRefreshToken() {
       console.log( localStorage.getItem('refresh_token'))
      return    localStorage.getItem('refresh_token')//getToken('refresh_token')
    }

     function _clearToken() {
       //await AsyncStorage.removeItem('access_token');
        //await AsyncStorage.removeItem('refresh_token');
           localStorage.removeItem('access_token');
           localStorage.removeItem('refresh_token');
      }

        function _setAccessToken(accessToken) {
         localStorage.setItem('access_token',accessToken)
        //await AsyncStorage.setItem('access_token', accessToken);
    }

    return {
        getService: _getService,
        setToken: _setToken,
        setAccessToken: _setAccessToken,
        getAccessToken: _getAccessToken,
        getRefreshToken: _getRefreshToken,
        clearToken: _clearToken,
    }
})();
export default AsyncStorageService;
