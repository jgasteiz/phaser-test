define([
    'Phaser',
    'utils/Config'
], function (Phaser, Config) {

    var game,
        config,
        spaceship,
        aliens;

    var InitialState = function (_game) {
        game = _game;
        config = Config.getConfig();
    };

    InitialState.prototype = {
        constructor: InitialState,
        preload: preload,
        create: create,
        update: update,
        render: render
    };

    return InitialState;

    /**
     * Preload
     */
    function preload () {
        game.load.image('space', 'img/starcraft-map.png');
        game.load.image('bullet', 'img/bullet.png');
        game.load.spritesheet('spaceship', 'img/spaceship_animation.png', 50, 70, 4);
        game.load.image('alien', 'img/invader.png');
        game.load.spritesheet('explosion', 'img/explode.png', 128, 128);
        game.time.advancedTiming = true;
    }

    /**
     * Create
     */
    function create () {
        // Create game
        game.world.setBounds(0, 0, config.worldHeight, config.worldWidth);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.starfield = game.add.sprite(0, 0, 'space');

        // Create spaceship
        spaceship = new Phaser.Spaceship(game, config.width / 2, config.height - 60, 'spaceship', 0);

        // Create some aliens
        aliens = game.add.group();
        aliens.enableBody = true;

        // Spawn the aliens
        Phaser.Alien.spawnAliensInGame(game, aliens, config.numAliens);

        // The camera should follow the spaceship
        game.camera.follow(spaceship);
    }

    /**
     * Update.
     */
    function update () {

        if (!spaceship.alive) {
            // TODO: Game over
            return;
        }

        spaceship.update();

        // Listen for mouse input and update the spaceship.
        if (game.input.activePointer.isDown && game.input.activePointer.isMouse) {
            var mousePointer = game.input.mousePointer;
            if (game.input.activePointer.button == Phaser.Mouse.RIGHT_BUTTON) {
                spaceship.fireOnXY(mousePointer.worldX, mousePointer.worldY);
            } else if (game.input.activePointer.button == Phaser.Mouse.LEFT_BUTTON) {
                spaceship.moveToXY(mousePointer.worldX, mousePointer.worldY);
            }
        }

        // Overlaps

        // When a bullet overlaps an alien, kill both sprites.
        game.physics.arcade.overlap(spaceship.bulletsGroup, aliens, function (bullet, alien) {
            if (alien.alive) {
                bullet.kill();
                alien.loseHealth(25);
            }
        }, null, this);
    }

    function render () {
        game.debug.text(game.time.fps || '--', config.width - 24, 14, "#00ff00");
        game.debug.text('Health: ' + spaceship.health, 12, 20, "#00ff00");
        // game.debug.body(spaceship);
    }
});
