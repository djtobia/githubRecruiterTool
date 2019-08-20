var merge = require('webpack-merge');
module.exports = {
    configureWebpack: config => {
        merge(config, {apikey: JSON.stringify(process.env.apikey)})
    }
};