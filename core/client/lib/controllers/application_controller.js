var ApplicationController = Ember.ObjectController.extend({
	profile: null,
	trip: null,
	needs: ['SidebarWaypoints'],
	isAuthenticated: function() {
		return App.Session.isAuthenticated();
	}.property('App.Session.user_auth_token'),
	hasActiveTrip: function() {
		return App.Session.hasActiveTrip();
	}.property('App.Session.user_active_trip'),
	profileChanged: function() {
		var self = this;
		var uid = App.Session.get('user_uid');
		if(uid.length > 0) {
			self.store.unloadAll('profile');
			Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
			  if (!jqXHR.crossDomain) {
			    jqXHR.setRequestHeader('X-AUTHENTICATION-TOKEN', App.Session.get('user_auth_token'));
			    jqXHR.setRequestHeader('X-UID', App.Session.get('user_uid'));
			  }
			});
			var user = self.store.find('profile', App.Session.get('user_uid'));
			self.set('profile', user);
		} else {
			self.store.unloadAll('profile');
			window.location.reload();
		}
	}.observes('App.Session.user_uid'),
	tripChanged: function() {
		var self = this;
		var uid = App.Session.get('user_active_trip');
		if(uid.length > 0) {
			self.store.unloadAll('trip');
			var trip = self.store.find('trip', App.Session.get('user_active_trip'));
			self.set('trip', trip);
		} else {
			var trip = {
				name: 'No Active Trip!',
				start_date: 'No Start',
				end_date: 'No End'
			};
			self.set('trip', trip);
		}
	}.observes('App.Session.user_active_trip'),
	trip: function() {
		var trip = {
			name: 'No Active Trip!',
			start_date: 'No Start',
			end_date: 'No End'
		};
		if(App.Session.get('user_active_trip')) {
			trip = this.store.find('trip', App.Session.get('user_active_trip'));
			this.store.unloadAll('waypoint');
			var controller = this.get('controllers.SidebarWaypoints');
			var model = this.store.find('waypoint', {trip: App.Session.get('user_active_trip')});
			controller.set('model', model);
			controller.send('plot');
		}
		return trip;
	}.property(),
	profile: function() {
		var user = this.store.find('profile', App.Session.get('user_uid'));
		return user;
	}.property(),
	actions: {
		closeCookieNotification: function() {
			$.cookie('TRP_COOKIENOTIF', false, {expires: 365});
			$('#cookies').css('display', 'none');
		}
	}
});

module.exports = ApplicationController;