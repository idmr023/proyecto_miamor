window.onload = function() {

  // ✨ CAMBIO AQUÍ: Usamos la altura de la ventana para un juego más alto y responsivo
  const ancho = Math.min(window.innerWidth, 600); // máximo 600px
  const alto = window.innerHeight;
  const game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'game-container');

  let fondoJuego;
  let jugador;
  let enemigos;
  let balas;
  // let puntos = 0; // ✨ CAMBIO AQUÍ: La variable puntos ya no es necesaria
  let puedeDisparar = true;
  let musicaFondo;
  let sonidoDisparo, sonidoExplosion;
  let teclaIzquierda, teclaDerecha;
  let nivel = 1;
  let juegoTerminado = false;

  // ✨ CAMBIO AQUÍ: La función ahora otorga premios por nivel completado
  const mostrarPremioNivel = (nivelCompletado) => {
    let mensaje = '';
    if (nivelCompletado === 1) mensaje = '¡Nivel 1 Superado! Has ganado una Pregunta Misteriosa 💌';
    if (nivelCompletado === 2) mensaje = '¡Nivel 2 Superado! ¡Cita Romántica desbloqueada! 🍕🎬';
    if (nivelCompletado === 3) mensaje = '¡Nivel 3 Superado! Tú eliges el premio 😘';
    if (mensaje) alert(mensaje);
  };

  const estadoInicio = {
    // ... (El estado de inicio no necesita cambios)
    preload: function () {
      game.load.image('fondoInicio', '/img/fondo.png');
      game.load.image('boton', '/img/boton.png');
      game.load.audio('inicioSonido', '/audio/music.mp3');
    },
    create: function () {
      // ✨ CAMBIO AQUÍ: El fondo también se adapta a la altura del juego
      fondoJuego = game.add.tileSprite(0, 0, game.width, game.height, 'fondoInicio');
      game.add.text(game.world.centerX, 100, '¡Bienvenid@ al juego del amor!', { font: '20px Arial', fill: '#000' }).anchor.set(0.5);
      game.add.text(game.world.centerX, 200, 'Instrucciones:\nDispara corazones para destruir el estrés.\nGana premios al completar cada nivel 💖', { font: '16px Arial', fill: '#000', align: 'center', wordWrap: true, wordWrapWidth: 300 }).anchor.set(0.5);
      const boton = game.add.button(game.world.centerX, 400, 'boton', () => {
        if (!musicaFondo || !musicaFondo.isPlaying) {
          musicaFondo = game.add.audio('inicioSonido');
          musicaFondo.volume = 0.3;
          musicaFondo.loopFull();
        }
        game.state.start('Juego');
      });
      boton.anchor.set(0.5);
    }
  };

  const estadoJuego = {
    preload: function () {
      game.load.image('fondo', '/img/fondo.png');
      game.load.image('fondoNivel2', '/img/fondo2.jpg');
      game.load.spritesheet('jugador', '/img/spritesheet1.png', 256, 256);
      game.load.image('enemigo', '/img/enemigo1.png');
      game.load.image('enemigo2', '/img/enemigo2.png');
      game.load.image('bala', '/img/laser.png');
      game.load.audio('disparo', '/audio/laser.mp3');
      game.load.audio('explosion', '/audio/colision.mp3');
    },
    create: function () {
      // ✨ CAMBIO AQUÍ: El fondo se adapta a la altura del juego
      fondoJuego = game.add.tileSprite(0, 0, game.width, game.height, 'fondo');

      // ✨ CAMBIO AQUÍ: La posición Y del jugador es relativa a la altura de la pantalla
      jugador = game.add.sprite(game.width / 2, game.height - 100, 'jugador');
      jugador.anchor.setTo(0.5);
      game.physics.arcade.enable(jugador);

      balas = game.add.group();
      balas.enableBody = true;
      balas.physicsBodyType = Phaser.Physics.ARCADE;
      balas.createMultiple(20, 'bala');
      balas.setAll('anchor.x', 0.5);
      balas.setAll('anchor.y', 1);
      balas.setAll('outOfBoundsKill', true);
      balas.setAll('checkWorldBounds', true);

      enemigos = game.add.group();
      enemigos.enableBody = true;
      enemigos.physicsBodyType = Phaser.Physics.ARCADE;
      this.crearOleada();

      game.add.tween(enemigos).to({ x: 150 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);

      sonidoDisparo = game.add.audio('disparo');
      sonidoExplosion = game.add.audio('explosion');
      sonidoDisparo.volume = 0.2;
      sonidoExplosion.volume = 0.2;

      teclaIzquierda = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      teclaDerecha = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.disparar, this);
    },
    update: function () {
      if (juegoTerminado) return;
      if (teclaIzquierda.isDown && jugador.x > 20) jugador.x -= 5;
      if (teclaDerecha.isDown && jugador.x < game.width - 20) jugador.x += 5;
      game.physics.arcade.overlap(balas, enemigos, this.colision, null, this);
    },
    disparar: function () {
      if (!puedeDisparar) return;
      puedeDisparar = false;
      game.time.events.add(Phaser.Timer.SECOND * 0.25, () => puedeDisparar = true);
      const bala = balas.getFirstExists(false);
      if (bala) {
        bala.reset(jugador.x, jugador.y);
        bala.body.velocity.y = -300;
        sonidoDisparo.play();
      }
    },
    crearOleada: function () {
      const posiciones = [ [0, 0], [70, 0], [140, 0], [210, 0], [0, 70], [70, 70], [140, 70], [210, 70] ];
      for (const [x, y] of posiciones) {
        // ✨ CAMBIO AQUÍ: El tipo de enemigo depende del nivel actual
        const tipoEnemigo = (nivel === 1) ? 'enemigo' : 'enemigo2';
        enemigos.create(x, y, tipoEnemigo);
      }
    },
    colision: function (bala, enemigo) {
      bala.kill();
      enemigo.kill();
      sonidoExplosion.play();
      // Ya no se gestionan puntos aquí

      if (enemigos.countLiving() === 0) {
        // ✨ CAMBIO AQUÍ: La lógica de premios se mueve aquí
        mostrarPremioNivel(nivel); // Otorgar premio del nivel actual
        
        // Pasar al siguiente nivel
        nivel++; 

        // Puedes añadir más niveles aquí
        if (nivel === 2) {
            fondoJuego.loadTexture('fondoNivel2');
            this.crearOleada(); // Crear oleada para el nivel 2
        } else {
            // Si no hay más niveles, termina el juego
            this.mostrarMensajeFinal();
        }
      }
    },
    mostrarMensajeFinal: function () {
      juegoTerminado = true;
      game.world.removeAll();
      fondoJuego = game.add.tileSprite(0, 0, game.width, game.height, 'fondoNivel2');
      const t = game.add.text(game.world.centerX, 300, 'Gracias por jugar con amor 💖', { font: '22px Arial', fill: '#fff', align: 'center' });
      t.anchor.set(0.5);
    }
  };

  game.state.add('Inicio', estadoInicio);
  game.state.add('Juego', estadoJuego);
  game.state.start('Inicio');
}