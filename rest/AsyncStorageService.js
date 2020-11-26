import AsyncStorage from '@react-native-community/async-storage'
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
        localStorage.setItem('access_token', tokenObj.accessToken);
        localStorage.setItem('refresh_token', tokenObj.refreshToken);
    }
    function _getAccessToken() {
        return localStorage.getItem('access_token');
    }
    function _getRefreshToken() {
        return localStorage.getItem('refresh_token');
    }
    function _clearToken() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
    function _setAccessToken(accessToken) {
        localStorage.setItem('access_token', accessToken);
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
