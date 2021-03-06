var Profile			= require('../models/profile'),
	Session			= require('../models/session');

module.exports = function(server) {

	server.get('/api/profiles/:id', Session.validate, function(req, res) {
		Profile.getProfileWithID(req.params.id, function(response, profile, flash) {
			if(response !== 200) {
				res.send(response, null, flash);
			} else {
				var profile = {
					'profile': profile
				};
				res.send(response, profile);
			}
		});
	});
}