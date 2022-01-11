function start() {
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima-apache'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima-helicopter'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima-friend'></div>");

    var jogo = {}

    //Game Loop
    jogo.timer = setInterval(loop, 60);
    function loop() {
        movefundo();
    }

    function movefundo() {
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda - 2);
    }
}


