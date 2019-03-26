const Util = require('@hzct/js-utils');

const APP_KEY = 'en.app.xz8nc';
const APP_SECRET = 'qset4iftcur3xw800t43dntdndwxtji8';

const $ = {};

const _baseUrl = 'https://api.kanshijie.com/v1/';
const _anonymousToken = 'anonymous';

const _anonymousAuth = () => {
    const userId = parseInt(Date.now() / 1000);
    const auth = `${userId}:${_anonymousToken}`;
    return `Bearer ${Util.$$encrypt.encodeBase64(auth)}`;
};

const _requester = Util.$$request.create({
    baseUrl: _baseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

Object.defineProperty($, 'baseUrl', {
    get: () => _baseUrl
});

Object.defineProperty($, 'authorization', {
    get: () => Util.$$storage.getItem('_admin_authorization') || null,
    set: (authorization) => {
        if (authorization === null || authorization === undefined) {
            Util.$$storage.removeItem('_admin_authorization');
        } else {
            Util.$$storage.setItem('_admin_authorization', String(authorization));
        }
    }
});

Object.defineProperty($, 'userInfo', {
    get: () => Util.$$storage.getItem('_admin_userInfo') || null,
    set: (userInfo) => {
        if (userInfo === null || userInfo === undefined) {
            Util.$$storage.removeItem('_admin_userInfo');
        } else {
            Util.$$storage.setItem('_admin_userInfo', userInfo);
        }
    }
});

Object.defineProperty($, 'accessInfo', {
    get: () => Util.$$storage.getItem('_admin_accessInfo') || null,
    set: (accessInfo) => {
        if (accessInfo === null || accessInfo === undefined) {
            Util.$$storage.removeItem('_admin_accessInfo');
        } else {
            Util.$$storage.setItem('_admin_accessInfo', accessInfo);
        }
    }
});

const parseUrl = (url, query) => {
    let result = '';
    // 生成资源路径
    if (Util.$$.isArray(url)) {
        result += url.join('/');
    } else {
        result += String(url || '');
    }
    // 生成查询字符串
    let _params = [];
    if (Util.$$.isObject(query)) {
        for (let k in query) {
            if (k === 'nonce' || k === 'signature' || k === 'timestamp' || k === 'app_key') continue;
            if (query[k] + '' === '' || query[k] === null) continue;

            _params.push(k + '=' + query[k]);
        }
    }
    // 生成时间戳、随机码和签名
    _params.push("app_key=" + APP_KEY);
    _params.push("timestamp=" + parseInt(new Date().getTime() / 1000));
    _params.push("nonce=" + getNonce(8));
    _params.push("client_ip=124.165.72.12");
    _params.sort();
    _params.push("signature=" + Util.$$encrypt.sha1(APP_SECRET, _params.join('&')).toLocaleLowerCase());
    _params = _params.join('&');
    result += _params.length > 0 ? `?${_params}` : '';
    return result;
};

const parseObjectPropsToCamel = (data) => {
    if (Util.$$.isArray(data)) {
        return data.map(item => parseObjectPropsToCamel(item));
    } else if (Util.$$.isObject(data)) {
        const ret = {};
        for (const prop in data) {
            if (Util.$$.isString(prop)) {
                let newProp = prop;
                while (newProp.includes('_')) {
                    newProp = newProp.replace(/_(\w)/g, (matches) => matches[1].toUpperCase());
                }
                ret[newProp] = parseObjectPropsToCamel(data[prop]);
            }
        }
        return ret;
    } else {
        return data;
    }
};

const parseObjectPropsToUnderline = (data) => {
    if (Util.$$.isArray(data)) {
        return data.map(item => parseObjectPropsToUnderline(item));
    } else if (Util.$$.isObject(data)) {
        const ret = {};
        for (const prop in data) {
            if (Util.$$.isString(prop)) {
                let newProp = prop.replace(/([a-z])([A-Z])/g, '$1_$2').toLocaleLowerCase();
                ret[newProp] = parseObjectPropsToUnderline(data[prop]);
            }
        }
        return ret;
    } else {
        return data;
    }
};

const getHeaders = () => {
    return {
        'Authorization': $.authorization || _anonymousAuth()
    };
};

const request = (options) => {
    const headers = getHeaders();
    if (options.nocache === true) {
        headers['Cache-Control'] = 'no-cache';
    }
    const method = options.method;
    const url = parseUrl(options.url, parseObjectPropsToUnderline(options.query));
    const data = parseObjectPropsToUnderline(options.data);
    const ignoreErrorCodes = options.ignore;
    return new Promise((resolve, reject) => {
        if (options.nocache) {
            headers['Cache-Control'] = 'no-cache';
        }
        _requester.request({
            method: method,
            url: url,
            headers: headers,
            data: data
        })
        .then(res => resolve(parseObjectPropsToCamel(res.data)))
        .catch(err => {
            if (err && err.response) {
                handleError(err.code, ignoreErrorCodes, () => reject(err));
            } else {
                reject(getError(0, 'Error'));
            }
        });
    });
};

const getNonce = (len) => {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let result = '';

    for (let i = 0; i < len; i++) {
        result += chars[Math.ceil(Math.random() * (chars.length - 1))];
    }
    return result;
};

const getError = (errCode, errMsg) => {
    let error = new Error(errMsg);
    error.code = errCode;
    return error;
};

const handleError = (errCode, ignoreErrorCodes, callback) => {
    if (!Util.$$.isFunction(callback)) {
        callback = () => {};
    }
    if (!Util.$$.isArray(ignoreErrorCodes)) {
        ignoreErrorCodes = Array(ignoreErrorCodes);
    }
    if (ignoreErrorCodes.includes('all')) {
        callback();
    } else if (errCode === 0 && !ignoreErrorCodes.includes(errCode)) {
        callback();
    } else if (errCode === 400 && !ignoreErrorCodes.includes(errCode)) {
        callback();
    } else if (errCode === 401 && !ignoreErrorCodes.includes(errCode)) {
        callback();
    } else if (errCode === 403 && !ignoreErrorCodes.includes(errCode)) {
        callback();
    } else if (errCode === 404 && !ignoreErrorCodes.includes(errCode)) {
        callback();
    } else if (errCode === 408 && !ignoreErrorCodes.includes(errCode)) {
        callback();
    } else if (errCode === 500 && !ignoreErrorCodes.includes(errCode)) {
        callback();
    } else {
        callback();
    }
};

$.get = (options) => request(Object.assign({}, options, {
    method: 'GET',
    data: null
}));

$.post = (options) => request(Object.assign({}, options, {
    method: 'POST'
}));

$.put = (options) => request(Object.assign({}, options, {
    method: 'PUT'
}));

$.patch = (options) => request(Object.assign({}, options, {
    method: 'PATCH'
}));

$.delete = (options) => request(Object.assign({}, options, {
    method: 'DELETE'
}));

export default $;