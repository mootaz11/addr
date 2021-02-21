import AsyncStorage from '@react-native-community/async-storage'

const getToken = async (item) => {
  let token = '';
  try {
    token = await AsyncStorage.getItem(item) || null;
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
    async  function _setToken(accessToken) {
      await  AsyncStorage.setItem('access_token',accessToken);
    }
    async function _clearAll(){
        await AsyncStorage.clear()
    }
    
       function _getAccessToken() {
      return    getToken('access_token')
   
    }
    

  async  function _clearToken() {
       await AsyncStorage.removeItem('access_token');
      
      }

        async function _setAccessToken(accessToken) {
          await AsyncStorage.setItem('access_token', accessToken);
    }

    return {
        clearAll:_clearAll,
        getService: _getService,
        setToken: _setToken,
        setAccessToken: _setAccessToken,
        getAccessToken: _getAccessToken,
        clearToken: _clearToken,
    }
})();
export default AsyncStorageService;
