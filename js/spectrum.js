/**
 * Created by richardjeffries on 15/02/17.
 */

var SPECCY = function(ctx) {
    return {
        xbound: 256,
        ybound: 192,
        _paper: 0,
        _ink: 7,
        _bright: false,
        _inverse: false,
        _ctx: ctx,
        colours: [ "#000000", "#0000D7", "#D70000", "#D700D7", "#00D700", "#00D7D7", "#D7D700", "#D7D7D7"],
        bright_colours:[ "#000000", "#0000FF", "#FF0000", "#FF00FF", "#00FF00", "#00FFFF", "#FFFF00", "#FFFFFF"],
        x: 0,
        y: 0,
        sprites: [],
        _test_bit: function(num,bit){
          return ((num>>bit) % 2 != 0)
        },
        create_sprite: function(data){
            var imageData = this._ctx.createImageData(8,8);
            for(var r = 0; r < 8 ; r++){
                for (var b = 0; b < 8; b++){
                    if(this._test_bit(data[r], b)){
                        imageData.data[(r * 8 + b) * 4] = 0;
                        imageData.data[(r * 8 + b) * 4 + 1] = 0;
                        imageData.data[(r * 8 + b) * 4 + 2] = 0;
                        imageData.data[(r * 8 + b) * 4 + 3] = 255;
                    } else{
                        imageData.data[(r * 8 + b) * 4] = 0;
                        imageData.data[(r * 8 + b) * 4 + 1] = 0;
                        imageData.data[(r * 8 + b) * 4 + 2] = 0;
                        imageData.data[(r * 8 + b) * 4 + 3] = 0;
                    }
                }
            }
            this.sprites.push(imageData);
        },
        _draw_sprite: function(name,x,y){
            this._ctx.putImageData(this.sprites[name],x,y);
        },
        plot: function (x,y){
            this.x = x;
            this.y = y;

        },
        draw: function(x,y, angle){
            var context = this._ctx;
            context.beginPath();
            context.moveTo(this.x,this.ybound-this.y);
            context.lineTo(this.x+x, this.ybound-this.y-y);
            context.stroke();
            this.x = this.x+x;
            this.y = this.y+y;
        },

        circle: function(x, y, r){

        },

        paper: function(colour){
            var colours = this._bright ? this.bright_colours : this.colours;
            this._paper = colours[colour];
        },

        ink: function(colour){
            var colours = this._bright ? this.bright_colours : this.colours;
            this._ink = colours[colour];
        },

        sprite_at : function(sprite, x, y){
            this._draw_sprite(sprite, 8*x, y*8);
        },

        print_at: function(text, x, y){
            this._ctx.font         = '8px ZXSpectrum';
            this._ctx.fillText  ('Keyboard Cat', 0, 270);
        },

        animation_loop: function(){
            //Paper first
            this._ctx.fillStyle(this.colours[this._paper]);
            this._ctx.fillRect(0,0,this.xbound,this.ybound);

        }
}};

function create_sprite(data){
    // takes short numbers and turns them into a sprite


}