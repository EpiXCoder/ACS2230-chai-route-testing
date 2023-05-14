const { expressjwt } = require('express-jwt');
const authenticate = expressjwt({ secret: process.env.MY_SECRET, algorithms: ['HS256'] });

module.exports = authenticate;