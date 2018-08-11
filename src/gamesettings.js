const GAME = {
    BG_COLOR: 51,
    ROW: 30,
    COL: 30,
    TILE_SIZE: 16,
    PLAYER_CONTROLS: ["87", "65", "83", "68", "32"],
    WEAPONS: [
        {dmg:1, s: 10, fr: 20}
    ],
    HEALTH: [100]
}

GAME.RES = {
    WIDTH: GAME.ROW * GAME.TILE_SIZE,
    HEIGHT: GAME.COL * GAME.TILE_SIZE
}