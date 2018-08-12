let HUD = {
    ARCADE: {
        point: 0,
        hp: 0,
        con: null,
        html_doc: null,
        init: function() {
            let con_ = document.createElement("div");
            con_.setAttribute("id", "hud_arcade");
            this.inithtml();
            con_.innerHTML = this.html_doc;
            document.getElementsByTagName("body")[0].insertBefore(con_, document.getElementById("defaultCanvas0"));

            this.con = document.getElementById("hud_arcade");
        },

        inithtml: function() {
            this.html_doc = `
                <div style="width: 480px; height: 45px; background-color: #0c0c0c; margin: auto; color: #fff; font-family: 'teeny_tiny_pixlsregular'; line-height: 45px; box-sizing: border-box; padding-left: 10px; padding-right: 10px; font-size: 12px;">
                    <div style="width: 160px; float: left; box-sizing: border-box; padding-left: 5px; padding-right: 5px;">
                        Scraps: ${this.point} 
                    </div>

                    <div style="width: 160px; float: left; box-sizing: border-box; padding-left: 5px; padding-right: 5px;">
                        HP: <div style="width: 70px; height: 20px; background-image: url('assets/hpbar.png'); display: inline-block; margin-top: -3px; vertical-align: middle;">
                        <div style="background-color: red; width: ${this.hp}px; height: 16px; margin: 2px; 2px;"></div>
                        </div>
                    </div>
                </div>
            `;
        },

        updatePoint: function(p) {
            this.point = p;
            this.set();
        },

        updateHP: function(p, k) {
            this.hp = (66 / p) * k;
            this.set();
        },

        set: function() {
            this.inithtml();
            this.con.innerHTML = this.html_doc;
        },

        delete: function() {
            this.con.innerHTML = `
                <div style="width: 480px; height: 45px; background-color: #000; margin: auto; color: #fff; font-family: 'teeny_tiny_pixlsregular'; line-height: 45px; box-sizing: border-box; padding-left: 10px; padding-right: 10px; font-size: 12px;">
                </div>
            `;
        }
    }
}