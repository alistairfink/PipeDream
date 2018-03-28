module.exports = {
	DefaultSettings: {
		theme: {
          name: 'Green',
          primaryColour: '#1b5e20',
          lightColour: '#4c8c4a',
          darkColour: '#003300',
          backgroundColour: 'black',
          textColour: 'white',
		},
		currency: 'USD',
		symbol: '$',
	},
	UpdateSettings: function(newSettings) {
		this.DefaultSettings = newSettings;
	},
	StorageNames: {
		settings: 'Settings',
	},
};