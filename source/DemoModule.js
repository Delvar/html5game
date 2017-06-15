define(
    'DemoModule',
    [ ],
    function () {
        function DemoModule (display) {
            this.display = display;
        }

        DemoModule.prototype.run = function (display) {
            //var scene = new Scene(setPieces, characters, spriteConfig, scripts);
            //display.runScene(scene);
			alert("DemoModule.run");
			console.log(display);
		
        };

        return DemoModule;
    }
);