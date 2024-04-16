// 假设你的api.js文件中的代码类似于这样
export const baseUrl = "http://127.0.0.1:8081";

export default {
    // 通用请求方法，增加了401处理逻辑
    request(method, url, param, headers) {
        return new Promise((resolve, reject) => {
            const token = uni.getStorageSync('token');
            const headers = headers || {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            uni.request({
                method: method,
                url: baseUrl + url,
                data: param,
                header: headers,
            }).then(res => {
                const [_, response] = res;
                // 检查是否返回了401状态码
                if (response.statusCode === 401) {
                    uni.showToast({
                        title: '登录过期，请重新登录',
                        icon: 'none',
                        duration: 2000,
                        complete: () => {
                            uni.navigateTo({ url: '/pages/public/login' });
                        }
                    });
                    reject(new Error('登录过期，请重新登录'));
                } else if (response.statusCode === 200) {
                    // 状态码为200，正常处理数据
                    resolve(response.data);
                } else {
                    // 对于所有其他状态码，展示后端返回的消息
                    uni.showToast({
                        title: response.data.message || '发生错误，请稍后重试',
                        icon: 'none',
                        duration: 2000
                    });
                    reject(new Error(response.data.message || '发生错误，请稍后重试'));
                }
            }).catch(err => {
                // 对于请求发送失败的情况，直接reject错误
                uni.showToast({
                    title: '请求失败，请检查网络设置',
                    icon: 'none',
                    duration: 2000
                });
                reject(err);
            });
        });
    },
    // 封装GET请求
    get(url, params) {
        return this.request('GET', url, params);
    },
    // 封装POST请求
    post(url, params) {
        return this.request('POST', url, params);
    },
    put(url, params) {
        return this.request('PUT', url, params);
    },
    delete(url, params) {
        return this.request('DELETE', url, params);
    },
    // 图片上传
    imgPost(url, params) {
        const headers = {
            'Content-Type': 'multipart/form-data',
        };
        return this.request('POST', url, params, headers);
    }
};
