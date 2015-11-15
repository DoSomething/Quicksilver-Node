/**
 * Application routes module. Routes define which objects to instantiate as
 * a result.
 */

module.exports = (function() {

  var express = require('express');
  var app = express();

  var router = express.Router();
  console.log("Loading model/model");
  var model = require('model/model');

  var Campaign = require('lib/campaign');

  if (app.get('env') == 'development') {
    // To output objects for debugging
    // console.log("/process request: " + util.inspect(request, false, null));
    var util = require('util');
  }

  /**
   * GET /api - report basic details about the API
   * GET /api/v1
   */
  router.get('/', function(req, res) {
    res.send(200, 'Message Broker Digest API (mb-digest-api). Available versions: v1 (/api/v1) See https://github.com/DoSomething/MessageBroker-Node/tree/master/mb-digest-api for the related git repository.');
  });
  router.get('/v1', function(req, res) {
    res.send(200, 'Message Broker Digest API (mb-digest-api). Version 1.x.x, see wiki (https://github.com/DoSomething/MessageBroker-Node/wiki) for documentation');
  });
  
  /**
   * POST to /v1/campaign
   *   POST values:
   *     - key string (mb-digest-campaign-<id>-<langauge>
   *     - value string (HTML markup)
   *
   * GET to /v1/campaign
   *   Required parameter:
   *     - id: The id of the desired campaign. The id value is defined in the Drupal app for each campaign node.
   */
  router.route('/v1/campaign')
  
    .post(function(req, res) {
      if (req.body.nid === undefined || req.body.language === undefined || req.body.markup === undefined) {
        res.send(400, 'POST /api/v1/campaign nid, language or markup not defined. ');
      }
      else {
        var campaign = new Campaign(model);
        campaign.post(req, res);
      }
    })
  
    .get(function(req, res) {
      if (req.query.key === undefined) {
        res.send(400, 'GET /api/v1/campaign key not defined. ');
      }
      else {
        var campaign = new Campaign(model);
        campaign.get(req, res);
      }
    });
    
    return router;
    
})();