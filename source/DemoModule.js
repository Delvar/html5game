define(
    'DemoModule',
    [
        'Character', 'DemoScene', 'config/scripts/CharacterController',
        'config/locales/churchyard',
        'config/characters/player-character', 'SetPiece'
    ],
    function (
        Character, DemoScene, CharacterController,
        localeConfig, characterConfig,
        SetPiece
    ) {
        function DemoModule (display) {
            this.display = display;
        }

        DemoModule.prototype.run = function () {
            var setPieces = {},
                characters = {'player-character': new Character(characterConfig)},                
                spriteConfig = [],
                scripts = [];

            scripts.push(new CharacterController('player-character'));

            _.each(localeConfig.setPieces, function (config, setPieceName) {
                setPieces[setPieceName] = new SetPiece(config);
            });

            _.each(localeConfig.scripts, function (script) {
                scripts.push(script);
            });

            _.each(localeConfig.sprites, function(config) {
                spriteConfig.push(config);
            });

            _.each(characterConfig.sprites, function(config) {
                spriteConfig.push(config);
            });

            var scene = new DemoScene(setPieces, characters, spriteConfig, scripts);
            this.display.runScene(scene);
        };

        return DemoModule;
    }
);