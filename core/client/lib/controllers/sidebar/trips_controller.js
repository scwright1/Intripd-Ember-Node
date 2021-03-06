var TripsController = Ember.ArrayController.extend({
	content: [],
	needs: ['map', 'SidebarWaypoints'],
	name: 'sidebar/trips_controller',
	debug: false,
	actions: {
		switch: function(trip) {
			var self = this;
			if(!trip) {
				//handle no trip error
			} else {
				//clear all previous waypoints
				self.store.unloadAll('waypoint');
				var controller = self.get('controllers.SidebarWaypoints');
				var model = self.store.find('waypoint', {trip: trip._data.uid});
				controller.set('model', model);
				controller.send('plot');
				//set the new active trip and close the menu
				App.Session.set('user_active_trip', trip._data.uid);
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
		}
	}
});

module.exports = TripsController;