var merge = require('webpack-merge')
module.exports = {
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
                apikey: JSON.stringify(process.env.apikey)
        } else {
            // mutate for development...
        }
    }
}