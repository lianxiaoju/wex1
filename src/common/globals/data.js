import Util from '@hzct/js-utils';
import _rest from '../services/_rest';

const $ = module.exports = {};

Object.defineProperty($, 'currentUser', {
    get: () => {
        let userInfo = Util.$$storage.getItem('_g_currentUser');

        if (!Util.$$.isObject(userInfo)) {
            userInfo = {};
        }

        userInfo = Object.assign({
            userSid: -1,
            nickname: '',
            avatarUrl: '',
        }, userInfo);
        if (userInfo.avatarUrl == '/0' || userInfo.avatarUrl==''){
            userInfo.avatarUrl ='../images/photo.png'
        }
        userInfo.isAnonymous = () => !(userInfo.userSid > 0 && _rest.authorization);
        return userInfo;
    },
    set: (userInfo) => {
        Util.$$storage.setItem('_g_currentUser', userInfo);
    }
});

// Object.defineProperty($, 'isGuided', {
//     get: () => {
//         return Util.$$storage.getItem('_g_flag_isGuided');
//     },
//     set: (value) => {
//         Util.$$storage.setItem('_g_flag_isGuided', !!value);
//     }
// });