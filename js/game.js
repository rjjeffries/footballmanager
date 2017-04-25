/**
 * Created by richardjeffries on 15/02/17.
 */

var GAME = {
     sprite_data : [24,88,126,26,120,72,206,2,
        48,48,24,60,28,56,48,40,
        24,24,30,58,24,42,36,32,
        24,24,24,28,60,24,28,8,
        24,24,60,90,90,60,36,102,
        0,0,0,0,0,0,3,3,
        24,26,126,88,30,18,115,64,
        12,12,24,60,56,28,12,20,
        24,24,120,92,24,84,36,4,
        24,24,24,56,60,24,56,8,
        0,0,0,0,0,0,192,192,
        24,24,61,90,56,28,20,36,
        24,24,188,90,28,56,40,36,
        12,12,60,91,152,62,64,
        192,48,48,60,218,25,124,2,3],

    left_pitch : "PLOT 71,88: DRAW -16,-8: DRAW -8,-16: DRAW 24,0: PLOT 8,0:DRAW 175,175: PLOT 72,64: DRAW 0,24: " +
    "DRAW 48,48: DRAW 0,-24: PLOT 64,56: DRAW 24,0: DRAW 64,64:DRAW -24,0: PLOT 32,24: DRAW 96,0: DRAW 115,115: DRAW -96,0: " +
    "PLOT 119,135: DRAW -16,-8:DRAW -8,-16: DRAW 24,0: PLOT 102,126: DRAW -48,-48: PLOT 158,84: DRAW 2,0: PLOT 158,85: DRAW 2,0:" +
    " PLOT 201,96",//: DRAW-40,-40,-2*PI/5",

    players_left: [0,1,2,3,4,15,14,7],
    players_right: [5,6,7,8],

    right_pitch: "PLOT 184,88: DRAW 16,-8: DRAW 8,-16: DRAW -24,0: PLOT 247,0: DRAW -175,175: PLOT 183,64: DRAW 0,24: " +
    "DRAW -48,48: DRAW 0,-24: PLOT 191,56: DRAW -24,0: DRAW -64,64: DRAW 24,0: PLOT 223,24:DRAW -96,0: DRAW -115,115: " +
    "DRAW 96,0: PLOT 136,135: DRAW 16,-8: DRAW 8,-16: DRAW -24,0: PLOT 153,126: DRAW 48,-48: PLOT 94,84: DRAW 2,0: " +
    "PLOT 94,85: DRAW 2,0: PLOT 55,96",//: DRAW 40, -40,2*PI/5"

    _rand: function(x){
      return parseInt(Math.random()*x + 1)
    },
    _draw_commands: function(commands){
      for(var i =0; i < commands.length; i++){
          var parts = commands[i].match(this._command_re)
          if(parts[1]==='PLOT'){
              this.speccy.plot(parseInt(parts[2]),parseInt(parts[3]))
          } else if (parts[1]=='DRAW') {
              this.speccy.draw(parseInt(parts[2]),parseInt(parts[3]))
          }
      }
    },

    draw_pitch: function(left){
        if(left===true){
            this._draw_commands(this.left_pitch.split(':'))
        } else {
            this._draw_commands(this.right_pitch.split(':'))
        }
    },

    plot_players: function(left){
        var forwards = [ [],[],[]];
        var defenders = [];
        var keeper= [];
        if(left===true){
            forwards[0][1] = 3 +this._rand(18);
            forwards[0][0] = 25 + this._rand(6);
            defenders[0] = forwards[0][0] - 1;
            defenders[1] = forwards[0][1];
            defenders[2] = -1;
            defenders[3] = 0;
            keeper[0] = 11+ this._rand(2) + 2 * (forwards[0][1] < 11) - 2 *(forwards[0][1] >10);
            keeper[1] = 23 - keeper[0];
            var self = this;
            function place_forwards(self) {
                for (var i = 1; i <= 2; i++) {
                    forwards[i][0] = 10 + self._rand(10);
                    forwards[i][1] = self._rand(25)
                    if(forwards[i][0] + forwards[i][1] > 25 ||
                    forwards[i][0]>forwards[0][0] -4){
                        return false;
                    }
                    for(var j =0 ;j<3;j++) {
                        if (forwards[j][1] == forwards[i][1] && j !== i) {
                            return false;
                        }
                    }
                }

                for(var i=0; i<3; i++){
                    g[i][0] = 10 + self._rand(10);
                    g[i][1] = self._rand(18);
                }
                return true;
            }
            while(!place_forwards());
        }
    },

    _command_re : /\ *(DRAW|PLOT)\ +(-?[0-9]{1,}),(-?[0-9]{1,})/,
     speccy : null,

    init_game: function(ctx){
        this.speccy = SPECCY(ctx);
        for (var i = 0; i <16; i++ ){
            this.speccy.create_sprite(this.sprite_data.slice(8*i, 8*i+8));
        }
    }
};

init_game = function(canvas) {
    var game = GAME;
    var ctx = canvas.getContext('2d');

    game.init_game(ctx);
    game.draw_pitch(true);
    game.plot_players(true);


};