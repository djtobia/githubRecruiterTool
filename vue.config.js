module.exports = {
    configureWebpack: config => {
            return { APIKEY: process.env.APIKEY};
    }
};