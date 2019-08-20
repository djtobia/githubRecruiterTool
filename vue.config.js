var merge = require('webpack-merge');
module.exports = {
    configureWebpack: config => {
        if(process.env.NODE_ENV === 'PRODUCTION')
            merge(config, {
                apikey: JSON.stringify(process.env.APIKEY)
            })
    }
};