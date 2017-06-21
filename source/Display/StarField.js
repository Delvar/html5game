define(
    'Display/StarField',
    ['underscore'],
    function (_) {
        function StarField (options) {
			var defaults = {
                test: 'test'
            };
            this.settings = _.extend(defaults, options);
			
			alert("StarField New");
        };

        StarField.prototype.start = function() {
			alert("StarField Start()");
        };

		alert("StarField Loaded");
        return StarField;
    }
);