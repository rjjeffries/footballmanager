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

    menu_items: [
        "1. START MATCH",
        "2. VIEW TEAM",
        "3. QUIT"
    ],
    selected_menu_item: 0,
    game_mode: "menu", // "menu" or "match"
    keys_pressed: {},

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
        var defenders = [ [],[],[]]; // defending team players (g in original)
        var ball = []; // ball position (d in original)
        var keeper= [];
        if(left===true){
            // Set up initial forward position
            forwards[0][1] = 3 + this._rand(18);
            forwards[0][0] = 25 + this._rand(6);

            // Set up ball position with forward
            ball[0] = forwards[0][0] - 1;
            ball[1] = forwards[0][1];
            ball[2] = -1;  // x velocity
            ball[3] = 0;   // y velocity

            // Set up keeper
            keeper[0] = 11 + this._rand(2) + 2 * (forwards[0][1] < 11) - 2 * (forwards[0][1] > 10);
            keeper[1] = 23 - keeper[0];

            var self = this;
            function place_forwards() {
                // Place remaining 2 forwards
                for (var i = 1; i <= 2; i++) {
                    forwards[i][0] = 10 + self._rand(10);
                    forwards[i][1] = self._rand(25);
                    if(forwards[i][0] + forwards[i][1] > 25 ||
                       forwards[i][0] > forwards[0][0] - 4){
                        return false;
                    }
                    for(var j = 0; j < 3; j++) {
                        if (forwards[j][1] == forwards[i][1] && j !== i) {
                            return false;
                        }
                    }
                }

                // Place 3 defenders
                for(var i = 0; i < 3; i++){
                    defenders[i][0] = 10 + self._rand(10);
                    defenders[i][1] = self._rand(18);
                    if(defenders[i][0] + defenders[i][1] < 24 ||
                       defenders[i][0] > forwards[0][0] - 4){
                        return false;
                    }
                    // Check for collisions with forwards and other defenders
                    for(var j = 0; j < 3; j++){
                        if((defenders[i][1] == forwards[j][1]) ||
                           (defenders[i][1] == defenders[j][1] && j !== i)){
                            return false;
                        }
                    }
                }
                return true;
            }
            while(!place_forwards());

            // Now draw all the players and ball
            // Draw forwards (attacking team) - using away color sprites (0,2,4)
            this.speccy.sprite_at(this.players_left[0], forwards[0][0], forwards[0][1]);
            for(var i = 1; i <= 2; i++){
                var sprite = forwards[i][1] < 10 ? this.players_left[2] : this.players_left[0];
                this.speccy.sprite_at(sprite, forwards[i][0], forwards[i][1]);
            }

            // Draw defenders (defending team) - using home color sprites (1,3)
            for(var i = 0; i < 3; i++){
                var sprite = defenders[i][1] < 10 ? this.players_left[3] : this.players_left[1];
                this.speccy.sprite_at(sprite, defenders[i][0], defenders[i][1]);
            }

            // Draw ball
            this.speccy.sprite_at(this.players_left[4], ball[0], ball[1]);

            // Draw keeper
            this.speccy.sprite_at(this.players_left[6], keeper[1], keeper[0]);

            // Store for animation
            this.game_state = {
                forwards: forwards,
                defenders: defenders,
                ball: ball,
                keeper: keeper,
                left: left
            };
        }
    },

    _command_re : /\ *(DRAW|PLOT)\ +(-?[0-9]{1,}),(-?[0-9]{1,})/,
     speccy : null,
     game_state : null,
     animation_frame : 0,

    init_game: function(ctx){
        this.speccy = SPECCY(ctx);
        for (var i = 0; i <16; i++ ){
            this.speccy.create_sprite(this.sprite_data.slice(8*i, 8*i+8));
        }
        this.setup_keyboard();
    },

    setup_keyboard: function(){
        var self = this;
        document.addEventListener('keydown', function(e){
            self.keys_pressed[e.key] = true;
            self.handle_keypress(e);
        });
        document.addEventListener('keyup', function(e){
            self.keys_pressed[e.key] = false;
        });
    },

    handle_keypress: function(e){
        if(this.game_mode === "menu"){
            if(e.key === "ArrowUp"){
                this.selected_menu_item = Math.max(0, this.selected_menu_item - 1);
                this.draw_menu();
                e.preventDefault();
            } else if(e.key === "ArrowDown"){
                this.selected_menu_item = Math.min(this.menu_items.length - 1, this.selected_menu_item + 1);
                this.draw_menu();
                e.preventDefault();
            } else if(e.key === "Enter" || e.key === " "){
                this.handle_menu_select();
                e.preventDefault();
            } else if(e.key >= "1" && e.key <= "3"){
                var num = parseInt(e.key) - 1;
                if(num < this.menu_items.length){
                    this.selected_menu_item = num;
                    this.handle_menu_select();
                }
                e.preventDefault();
            }
        }
    },

    handle_menu_select: function(){
        switch(this.selected_menu_item){
            case 0: // Start Match
                this.game_mode = "match";
                this.start_match();
                break;
            case 1: // View Team
                this.show_message("TEAM VIEWER NOT YET IMPLEMENTED");
                break;
            case 2: // Quit
                this.show_message("THANKS FOR PLAYING!");
                break;
        }
    },

    show_message: function(text){
        var ctx = this.speccy._ctx;
        ctx.fillStyle = "#D7D700";
        ctx.fillRect(32, 80, 192, 32);
        ctx.fillStyle = "#000000";
        ctx.font = "12px monospace";
        ctx.fillText(text, 40, 100);
    },

    draw_menu: function(){
        var ctx = this.speccy._ctx;

        // Clear screen with background color
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 256, 192);

        // Draw title
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 16px monospace";
        ctx.fillText("FOOTBALL MANAGER", 40, 30);

        ctx.font = "12px monospace";
        ctx.fillText("1982 K.TOMS - JS VERSION", 24, 50);

        // Draw menu items
        ctx.font = "14px monospace";
        for(var i = 0; i < this.menu_items.length; i++){
            if(i === this.selected_menu_item){
                // Highlight selected item
                ctx.fillStyle = "#FFFF00";
                ctx.fillRect(40, 80 + i * 25, 180, 20);
                ctx.fillStyle = "#000000";
            } else {
                ctx.fillStyle = "#FFFFFF";
            }
            ctx.fillText(this.menu_items[i], 48, 95 + i * 25);
        }

        // Instructions
        ctx.fillStyle = "#00D7D7";
        ctx.font = "10px monospace";
        ctx.fillText("USE ARROW KEYS OR 1-3 TO SELECT", 16, 175);
        ctx.fillText("PRESS ENTER TO CONFIRM", 40, 188);
    },

    start_match: function(){
        // Clear screen and draw pitch
        var ctx = this.speccy._ctx;
        ctx.fillStyle = '#00D7D7';
        ctx.fillRect(0, 0, 256, 192);

        this.draw_pitch(true);
        this.plot_players(true);

        // Start the match animation after a brief delay
        var self = this;
        setTimeout(function(){
            self.animate_match();
        }, 500);
    },

    animate_match: function(){
        if(!this.game_state) return;

        var ball = this.game_state.ball;
        var forwards = this.game_state.forwards;
        var keeper = this.game_state.keeper;

        this.animation_frame++;

        // Phase 1: Dribble left (first 5 frames)
        if(this.animation_frame <= 5){
            // Clear old ball position
            this.speccy.sprite_at(5, ball[0], ball[1]); // sprite 5 is empty/background

            // Move ball left
            ball[0] = ball[0] - 1;
            ball[1] = ball[1]; // y stays same during dribble

            // Draw new ball position
            this.speccy.sprite_at(this.players_left[4], ball[0], ball[1]);
        }
        // Phase 2: Kick towards goal
        else if(this.animation_frame <= 30){
            // Clear old ball position
            this.speccy.sprite_at(5, ball[0], ball[1]);

            // Set velocity towards goal on first kick frame
            if(this.animation_frame == 6){
                ball[2] = -2; // move left
                ball[3] = (ball[1] < 8) ? 1 : (ball[1] > 15) ? -1 : (this._rand(2) - 1.5) * 2; // aim for goal
            }

            // Move ball
            ball[0] = ball[0] + ball[2];
            ball[1] = ball[1] + ball[3];

            // Check boundaries (out of bounds)
            if(ball[0] < 0 || ball[1] < 0 || ball[1] > 21 || ball[0] + ball[1] < 22){
                // Ball went out
                this.animation_frame = 100; // End animation
                return;
            }

            // Check for goal (left goal area is roughly x < 8, y between 8-14)
            if(ball[0] < 8 && ball[1] >= 8 && ball[1] <= 14){
                // GOAL!
                this.speccy.sprite_at(this.players_left[4], ball[0], ball[1]);
                var ctx = this.speccy._ctx;
                ctx.fillStyle = "#00D7D7";
                ctx.fillRect(80, 10, 100, 20);
                ctx.fillStyle = "#000000";
                ctx.font = "16px monospace";
                ctx.fillText("GOAL!", 90, 25);
                this.animation_frame = 100;
                return;
            }

            // Draw ball at new position
            this.speccy.sprite_at(this.players_left[4], ball[0], ball[1]);
        }
        else {
            // Animation complete
            return;
        }

        // Continue animation
        var self = this;
        setTimeout(function(){ self.animate_match(); }, 100); // ~10fps
    }
};

init_game = function(canvas) {
    var game = GAME;
    var ctx = canvas.getContext('2d');

    game.init_game(ctx);

    // Show the main menu
    game.draw_menu();
};