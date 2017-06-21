
define(
    'DemoScene',
    ['underscore', 'mixins/Events'],
    function (_, Events) {
        function DemoScene (setPieces, characters, spriteConfig, scripts) {
            this.setPieces = setPieces;
            this.characters = characters;
            this.spriteConfig = spriteConfig;
            this.scripts = [];

            _.each(scripts, function (script) {
                script.listenTo(this);
                this.scripts.push(script);
            }, this);
        }

        _.extend(DemoScene.prototype, Events);

        DemoScene.prototype.getSpriteConfig = function () {
            return this.spriteConfig;
        };

        DemoScene.prototype.getCharacters = function() {
            return _.keys(this.characters);
        };

        DemoScene.prototype.getCharacter = function(name) {
            return this.characters[name];
        };

        DemoScene.prototype.changeCharacterPosition = function(characterName) {
            if(_.isNumber(arguments[1] & _.isNumber(arguments[2]))) {
                this.getCharacter(characterName).x += arguments[1];
                this.getCharacter(characterName).y += arguments[2];
            }
            else if(_.isArray(arguments[1]) && arguments[1].length == 2) {
                this.getCharacter(characterName).x = arguments[1][0];
                this.getCharacter(characterName).y = arguments[1][1];
            }
        };

        DemoScene.prototype.changeCharacterState = function(characterName, state) {
            this.getCharacter(characterName).state = state;
            this.trigger(
                'change:character-state',
                {
                    'scene': this, 
                    'subject': characterName, 
                    'state': state
                },
                this.eventHandlers);
        };

        DemoScene.prototype.getSetPieces = function() {
            return _.keys(this.setPieces);
        };

        DemoScene.prototype.getSetPiece = function(name) {
            return this.setPieces[name];
        };

        DemoScene.prototype.changeSetPieceState = function(setPieceName, state) {
            this.getSetPiece(setPieceName).state = state;
            this.trigger(
                'change:set-piece-state', 
                {
                    'scene': this, 
                    'subject': setPieceName, 
                    'state': state
                },
                this.eventHandlers);
        };

        return DemoScene;
    }
);