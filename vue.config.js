var merge = require('webpack-merge');
module.exports = {
    configureWebpack: config => {
            merge(config, {APIKEY: process.env.APIKEY});
    }
};