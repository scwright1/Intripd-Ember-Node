var Waypoint = require('../models/waypointmodel');
var Session = require('../models/sessionmodel');

module.exports = function(server) {
	server.post('/api/waypoints', Session.checkSession, function(req,res) {
		Waypoint.Create(req.headers['x-uid'], req.body.waypoint, function(response, waypoint) {
			if(response == 200) {
				res.send({'waypoint': waypoint});
			} else {
				res.send(400);
			}
		});
	});
	server.get('/api/waypoints', Session.checkSession, function(req, res) {
		Waypoint.getWaypoints(req.query.trip_uid, function(response, data) {
			if(response === 200) {
				var ret = {
					'waypoint': data
				};
				res.send(ret);
			}
		});
	});
}