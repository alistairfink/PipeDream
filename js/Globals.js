module.exports = {
	DefaultSettings: {
		theme: {
          name: 'Light',
          primaryColour: '#bdbdbd',
          lightColour: '#efefef',
          darkColour: '#8d8d8d',
          backgroundColour: 'white',
          textColour: 'black',
		},
		currency: 'USD',
	},
	UpdateSettings: function(newSettings) {
		this.DefaultSettings = newSettings;
	},
	StorageNames: {
		settings: 'Settings',
	},
};