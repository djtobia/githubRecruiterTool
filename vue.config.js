module.exports = {
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.apikey = JSON.stringify(process.env.apikey);
        }

    }
}