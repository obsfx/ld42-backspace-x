let HUD = {
    ARCADE: {
        point: 0,
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
                <div style="width: 480px; height: 45px; background-color: #000; margin: auto; color: #fff">
                    Score: ${this.point}
                </div>
            `;
        },

        updatePoint: function(p) {
            this.point = p;
            this.set();
        },

        set: function() {
            this.inithtml();
            this.con.innerHTML = this.html_doc;
        }
    }
}