var ws;
var wireUp = function() {
    if (!ws) {
      ws = new WebSocket('ws://192.168.1.11:3000/events');
    }

    ws.onmessage = function(event) {
      //console.log('event:', event);
      var message = JSON.parse(event.data);
      if (message.destination === 'button/pressing') {
        me.input.triggerKeyEvent(me.input.KEY.SPACE, true);
        setTimeout(function() {
          me.input.triggerKeyEvent(me.input.KEY.SPACE, false);
        }, 15);
      }
    };

    ws.onopen = function() {
      console.log('opening');
      ws.send(JSON.stringify({ cmd: 'subscribe', name: 'button/pressing' }))
    };
};
var game = {
  data: {
    score : 0,
    steps: 0,
    start: false,
    newHiScore: false
  },

  "onload": function() {
    if (!me.video.init("screen", 900, 600, true, 'auto')) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    me.audio.init("mp3,ogg");
    me.loader.onload = this.loaded.bind(this);
    me.loader.preload(game.resources);
    me.state.change(me.state.LOADING);

    wireUp();

  },

  "loaded": function() {
    me.state.set(me.state.MENU, new game.TitleScreen());
    me.state.set(me.state.PLAY, new game.PlayScreen());
    me.state.set(me.state.GAME_OVER, new game.GameOverScreen());

    me.input.bindKey(me.input.KEY.SPACE, "fly", true);
    me.input.bindTouch(me.input.KEY.SPACE);

    me.pool.register("clumsy", BirdEntity);
    me.pool.register("pipe", PipeEntity, true);
    me.pool.register("hit", HitEntity, true);

    // in melonJS 1.0.0, viewport size is set to Infinity by default
    me.game.viewport.setBounds(0, 0, 900, 600);
    me.state.change(me.state.MENU);
  }
};
