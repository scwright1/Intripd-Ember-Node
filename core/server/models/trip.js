var mongoose 		= require('mongoose'),
	uuid 			= require('node-uuid');

var tripSchema = mongoose.Schema({
	uid: {type: String},
	creator_uid: {type: String},
	name: {type: String},
	creation_date: {type: Date},
	start_date: {type: Date},
	end_date: {type: Date},
	lat: {type: String},
	lng: {type: String},
	zoom: {type: Number}
});

tripSchema.statics.createTrip = function(creator_uid, data, done) {
	var Trip = this;
	if(!creator_uid) {
		return done(400, 'No UID', null);
	} else {
		Trip.create({
			uid : uuid.v4(),
			creator_uid: creator_uid,
			name : data.name,
			creation_date : new Date(),
			start_date : data.start_date,
			end_date : data.end_date,
			lat : data.lat,
			lng : data.lng,
			zoom : data.zoom
		}, function(err, t) {
			if(err) {
				return done(400, err, null);
			} else {
				var trip = {
					'uid': t.uid,
					'id': t._id,
					'creator_uid': t.creator_uid,
					'name': t.name,
					'creation_date': t.creation_date,
					'start_date': t.start_date,
					'end_date': t.end_date,
					'lat': t.lat,
					'lng': t.lng,
					'zoom': t.zoom
				};
				return done(200, null, trip);
			}
		});
	}
}

tripSchema.statics.getTrips = function(creator_uid, done) {
	var Trip = mongoose.model('Trip', tripSchema);
	if(!creator_uid) {
		return done(400);
	} else {
		Trip.find({creator_uid: creator_uid}, function(err, trips) {
			if((err) || (trips === null)) {
				return done(400);
			} else {
				var t = new Array();
				for(var i = 0; i < trips.length; i++) {
					var tmp = {
						'uid': trips[i].uid,
						'id': trips[i].id,
						'creator_uid': trips[i].creator_uid,
						'name': trips[i].name,
						'creation_date': trips[i].creation_date,
						'start_date': trips[i].start_date,
						'end_date': trips[i].end_date,
						'lat': trips[i].lat,
						'lng': trips[i].lng,
						'zoom': trips[i].zoom
					};
					t.push(tmp);
				}
				return done(200, t);
			}
		});
	}
}

tripSchema.statics.getTrip = function(uid, done) {
	var Trip = this;
	if(!uid) {
		return done(400);
	} else {
		Trip.findOne({uid: uid}, function(err, trip) {
			var tmp;
			if((err) || (trip === null)) {
				return done(400);
			} else {
				tmp = {
					'uid': trip.uid,
					'id': trip.id,
					'creator_uid': trip.creator_uid,
					'name': trip.name,
					'creation_date': trip.creation_date,
					'start_date': trip.start_date,
					'end_date': trip.end_date,
					'lat': trip.lat,
					'lng': trip.lng,
					'zoom': trip.zoom
				};
			}
			return done(200, tmp);
		});
	}
}

tripSchema.statics.deleteTrip = function(id, done) {
	var Trip = this;
	if(!id) {
		return done(400);
	} else {
		Trip.findById(id, function(err, trip) {
			if(err) {
				return done(400);
			} else {
				trip.remove(function(err, code) {
					if(err) {
						return done(400);
					} else {
						return done(200);
					}
				});
			}
		});
	}
}

var Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;