module.exports = {
    create: function () {

    var express = require('express');

    var admin = express();

    admin.get('', function (req, res) {
        res.end('Welcome to manager');
    });

    return admin;
  }
};
