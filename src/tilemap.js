let TILE_MAP = {
    arr: [],

    init: function() {
        for (let i = 0; i < GAME.ROW; i++) {
            this.arr.push([]);
            for (let j = 0; j < GAME.COL; j++) {
                this.arr[i].push(1);
            }
        }
    },

    render: function() {
        for (let i = 0; i < GAME.ROW; i++) {
            for (let j = 0; j < GAME.COL; j++) {
                stroke(0);
                fill(51);
                rect(i * GAME.TILE_SIZE, j * GAME.TILE_SIZE, GAME.TILE_SIZE, GAME.TILE_SIZE);
            }
        }

    }
}