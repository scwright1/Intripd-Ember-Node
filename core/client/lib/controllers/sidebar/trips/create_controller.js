var CreateController = Ember.ObjectController.extend({
	needs: ['map'],
	tripname: null,
	departing: null,
	returning: null,
	flash: null,
	actions: {
		create: function() {
			//todo - validate creation fields and return flash if invalid data
			var self = this;
			self.set('flash', null);
			function convertDateToISO(dateString) {
				var rawDate = dateString.split('/');
				var date = new Date(Date.UTC(rawDate[2],rawDate[1]-1,rawDate[0],0,0));
				return date.toISOString();
			}

			//gathering trip information
			var data = this.getProperties('tripname', 'departing', 'returning');

			if(!data.tripname) {
				self.set('flash', 'Your trip name cannot be blank!');
			} else {
				if(!data.departing) {
					data.departing = "01/01/1970";
				}

				if(!data.returning) {
					data.returning = "01/01/1970";
				}

				//create record
				var trip = this.store.createRecord('trip', {
					name: data.tripname,
					start_date: convertDateToISO(data.departing),
					end_date: convertDateToISO(data.returning),
					creator_uid: App.Session.get('uid')
				});

				//persist the record
				var promise = trip.save();
				promise.then(fulfill, reject);
				function fulfill(model) {
					var marker_index = self.get('controllers.map').get('markers');
					for (var i = 0; i < marker_index.length; i++) {
						marker_index[i].setMap(null);
					}
					App.Session.set('trip', model._data);
					App.Session.set('user_active_trip', model._data.uid);
					self.set('tripname', null);
					self.set('departing', null);
					self.set('returning', null);
					$('#sidebar-menu').data('fill', false);
					$('#sidebar-menu').removeClass('active');
					$('#sidebar-menu').animate({'left': (80 - $('#sidebar-menu').width())+'px'}, {duration: 400, queue: false});
					$('#map-canvas').animate({'left': '80px'}, {duration: 400, queue: false, step: function() {
						google.maps.event.trigger(self.get('controllers.map').get('map'), 'resize');
					}});
					$('#sidebar > .menu-item').each(function() {
						if($(this).hasClass('active')) {
							$(this).removeClass('active');
						}
					});
				}

				function reject(reason) {
					alert(reason);
				}
			}
		},
		reset: function() {
			this.set('tripname', null);
			this.set('departing', null);
			this.set('returning', null);
		}
	}
});

module.exports = CreateController;