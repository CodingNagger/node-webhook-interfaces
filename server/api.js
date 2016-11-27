module.exports = {
    create: function () {

    // Initialize WebHooks module.
    var WebHooks = require('node-webhooks');
    var bodyParser = require('body-parser');

    var webHooksDBPath = './webHooksDB.json';

    var webHooks = new WebHooks({
      db: webHooksDBPath, // json file that store webhook URLs
    });

    var express = require('express');
    var emitter = webHooks.getEmitter();

    emitter.on('*.success', function (shortname, statusCode, body) {
        console.log('Success on trigger webHook ' + shortname + ' with status code', statusCode, 'and body', body);
    });

    emitter.on('*.failure', function (shortname, statusCode, body) {
        console.error('Error on trigger webHook ' + shortname + ' with status code', statusCode, 'and body', body);
    });

    var api = express();

    api.use(bodyParser.json());

    api.get('/webhook/', function (req, res) {
      webHooks.getDB().then(function(result){
        res.end(JSON.stringify(result));
      }).catch(function(err){
        console.log(err);

        res.statusCode = 500;
        res.end();
      });
    })

    api.get('/webhook/table', function (req, res) {
      webHooks.getDB().then(function(result){
        var responseData = [];

        Object.keys(result).forEach(function(key) {
            console.log(key, result[key]);

            var len = result[key].length;
            for (var i = 0; i < len; i++) {
                responseData.push({
                    key: key,
                    url: result[key][i]
                });
            }
        });

        res.end(JSON.stringify({ data: responseData }));
      }).catch(function(err){
        console.log(err);

        res.statusCode = 500;
        res.end();
      });
    })

    api.post('/webhook/:key/trigger', function (req, res) {
      var body = JSON.stringify(req.body);

      req.headers['content-length'] = body.length;

      webHooks.trigger(req.params.key, req.body, req.headers);
      res.end();
    })

    api.get('/webhooks/:key/urls', function (req, res) {
      webHooks.getWebHook(req.params.key).then(function(result) {
        if (Object.keys(result).length === 0 && result.constructor === Object) {
          res.statusCode = 204;
        }

        var data = JSON.stringify(result);

        console.log(data);

        res.end(data);
      }).catch(function(err){
        console.log(err);

        res.statusCode = 500;
        res.end();
      });
    })

    api.post('/webhooks/:key/urls', function (req, res) {
      var urls = req.body;
      var errorCount = 0;

      if (urls.length === 0) {
        res.statusCode = 400;
        res.end();
      }

      urls.forEach(function(url) {
        webHooks.add(req.params.key, url).then(function(){

        }).catch(function(err){
          console.log(err);
          errorCount++;
        });
      });

      if (errorCount === urls.length) {
        res.statusCode = 500;
      }

      res.end();
    })

    api.delete('/webhooks/:key/urls', function (req, res) {
      var urls = req.body;

      if (Object.keys(urls).length === 0 && urls.constructor === Object) {
        webHooks.remove(req.params.key).then(function(){

        }).catch(function(err){
          console.log(err);
          res.statusCode = 500;
        });
      }
      else {
        urls.forEach(function(url) {
          webHooks.remove(req.params.key, url).then(function(){

          }).catch(function(err){
            console.log(err);
            res.statusCode = 500;
          });
        });
      }

      res.end();
    })

    /**
     * Mildly restful-ish endpoints created to accomodate with the DataTable UI querying
     */
     api.get('/webhook/entries', function (req, res) {
       webHooks.getDB().then(function(result){
         var responseData = [];

         Object.keys(result).forEach(function(key) {
             console.log(key, result[key]);

             var len = result[key].length;
             for (var i = 0; i < len; i++) {
                 responseData.push(
                    [ key, result[key][i]]
                 );
             }
         });

         res.end(JSON.stringify({ data: responseData }));
       }).catch(function(err){
         console.log(err);

         res.statusCode = 500;
         res.end();
       });
     })

     api.post('/webhooks/entries/add', function (req, res) {
       var entry = req.body.data[0];

       webHooks.add(entry.key, entry.url).then(function(){

       }).catch(function(err) {
         res.statusCode = 500;
         console.log(err);
       });

       res.end();
     })

     api.post('/webhooks/entries/update', function (req, res) {
       var entry = req.body.data[0];

       webHooks.add(entry.key, entry.url).then(function(){
         webHooks.remove(entry.key, entry.url).then(function(){

         }).catch(function(err) {
           console.log(err);
           res.statusCode = 500;
         });
       }).catch(function(err) {
         res.statusCode = 500;
         console.log(err);
       });

       res.end();
     })

     api.post('/webhooks/entries/remove', function (req, res) {
       var entry = req.body.data[0];

       webHooks.remove(entry.key, entry.url).then(function(){

       }).catch(function(err){
         console.log(err);
         res.statusCode = 500;
       });

       res.end();
     })

    return api;
  }
};
