function start() {
    $("#start").hide();

    $("#bgGame").append("<div id='player' class='anima-apache'></div>");
    $("#bgGame").append("<div id='enemy1' class='anima-helicopter'></div>");
    $("#bgGame").append("<div id='enemy2'></div>");
    $("#bgGame").append("<div id='friend' class='anima-friend'></div>");
    $("#bgGame").append("<div id='placar'></div>");
    $("#bgGame").append("<div id='energia'></div>");

    const shotVelocity = 20;  // + faster
    var game = {}
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);
    var podeAtirar = true;
    var fimdejogo = false;
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energiaAtual = 3;

    var TECLA = {
        UP: 38,
        W: 87,
        DOWN: 40,
        S: 83,
        RIGHT: 39,
        D: 68
    }

    game.pressionou = [];

    var musica = document.getElementById("musica");
    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    //Música em loop
    musica.addEventListener("ended", function () { musica.currentTime = 0; musica.play(); }, false);
    musica.play();

    //Verifica se o usuário pressionou alguma tecla	
    $(document).keydown(function (e) {
        game.pressionou[e.which] = true;
    });


    $(document).keyup(function (e) {
        game.pressionou[e.which] = false;
    });

    //Game Loop
    game.timer = setInterval(loop, 60);
    function loop() {
        movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();
    }

    function movefundo() {
        esquerda = parseInt($("#bgGame").css("background-position"));
        $("#bgGame").css("background-position", esquerda - 2);
    }

    function movejogador() {
        if (game.pressionou[TECLA.W] || game.pressionou[TECLA.UP]) {
            var topo = parseInt($("#player").css("top"));
            $("#player").css("top", topo - 10);
            if (topo <= 0) {
                $("#player").css("top", topo + 10);
            }
        }

        if (game.pressionou[TECLA.S] || game.pressionou[TECLA.DOWN]) {

            var topo = parseInt($("#player").css("top"));
            $("#player").css("top", topo + 10);
            if (topo >= 434) {
                $("#player").css("top", topo - 10);
            }
        }

        if (game.pressionou[TECLA.D] || game.pressionou[TECLA.RIGHT]) {
            shot();
        }
    }

    function moveinimigo1() {
        posicaoX = parseInt($("#enemy1").css("left"));
        $("#enemy1").css("left", posicaoX - velocidade);
        $("#enemy1").css("top", posicaoY);

        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334);
            $("#enemy1").css("left", 694);
            $("#enemy1").css("top", posicaoY);
        }
    }

    function moveinimigo2() {
        posicaoX = parseInt($("#enemy2").css("left"));
        $("#enemy2").css("left", posicaoX - 3);

        if (posicaoX <= 0) {
            $("#enemy2").css("left", 775);

        }
    }

    function moveamigo() {
        posicaoX = parseInt($("#friend").css("left"));
        $("#friend").css("left", posicaoX + 1);

        if (posicaoX > 906) {
            $("#friend").css("left", 0);
        }
    }

    function shot() {
        somDisparo.play();
        if (podeAtirar == true) {
            podeAtirar = false;
            topo = parseInt($("#player").css("top"))
            posicaoX = parseInt($("#player").css("left"))
            tiroX = posicaoX + 182;
            topoTiro = topo + 52;
            $("#bgGame").append("<div id='shot'></div");
            $("#shot").css("top", topoTiro);
            $("#shot").css("left", tiroX);

            var tempoDisparo = window.setInterval(executaDisparo, 20);
        }

        function executaDisparo() {
            posicaoX = parseInt($("#shot").css("left"));
            $("#shot").css("left", posicaoX + shotVelocity);

            if (posicaoX > 900) {

                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#shot").remove();
                podeAtirar = true;
            }
        }
    }

    function colisao() {
        var colisao1 = ($("#player").collision($("#enemy1")));
        var colisao2 = ($("#player").collision($("#enemy2")));
        var colisao3 = ($("#shot").collision($("#enemy1")));
        var colisao4 = ($("#shot").collision($("#enemy2")));
        var colisao5 = ($("#player").collision($("#friend")));
        var colisao6 = ($("#enemy2").collision($("#friend")));

        // player com o enemy1
        if (colisao1.length > 0) {
            energiaAtual--;
            inimigo1X = parseInt($("#enemy1").css("left"));
            inimigo1Y = parseInt($("#enemy1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            posicaoY = parseInt(Math.random() * 334);
            $("#enemy1").css("left", 694);
            $("#enemy1").css("top", posicaoY);
        }

        // player com o enemy2 
        if (colisao2.length > 0) {
            energiaAtual--;
            inimigo2X = parseInt($("#enemy2").css("left"));
            inimigo2Y = parseInt($("#enemy2").css("top"));
            explosao2(inimigo2X, inimigo2Y);
            $("#enemy2").remove();
            reposicionaInimigo2();
        }
        // shot com enemy1
        if (colisao3.length > 0) {
            pontos = pontos + 100;
            velocidade = velocidade + 0.3;
            inimigo1X = parseInt($("#enemy1").css("left"));
            inimigo1Y = parseInt($("#enemy1").css("top"));
            explosao1(inimigo1X, inimigo1Y);
            $("#shot").css("left", 950);
            posicaoY = parseInt(Math.random() * 334);
            $("#enemy1").css("left", 694);
            $("#enemy1").css("top", posicaoY);
        }
        // shot com enemy2
        if (colisao4.length > 0) {
            pontos = pontos + 50;
            inimigo2X = parseInt($("#enemy2").css("left"));
            inimigo2Y = parseInt($("#enemy2").css("top"));
            $("#enemy2").remove();
            explosao2(inimigo2X, inimigo2Y);
            $("#shot").css("left", 950);
            reposicionaInimigo2();
        }

        // player salva friend
        if (colisao5.length > 0) {
            somResgate.play();
            salvos++;
            pontos += 350;
            reposicionaAmigo();
            $("#friend").remove();
        }

        // friend perdido
        if (colisao6.length > 0) {
            perdidos++;
            pontos -= 700;
            amigoX = parseInt($("#friend").css("left"));
            amigoY = parseInt($("#friend").css("top"));
            explosao3(amigoX, amigoY);
            $("#friend").remove();
            reposicionaAmigo();
        }
    }

    function explosao1(inimigo1X, inimigo1Y) {
        somExplosao.play();
        $("#bgGame").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(assets/img/explosao.png)");
        var div = $("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({ width: 200, opacity: 0 }, "slow");

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

        function removeExplosao() {
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }
    }

    function explosao2(inimigo2X, inimigo2Y) {
        somExplosao.play();
        $("#bgGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(assets/img/explosao.png)");
        var div2 = $("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({ width: 200, opacity: 0 }, "slow");

        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

        function removeExplosao2() {

            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;
        }
    }

    function explosao3(amigoX, amigoY) {
        somPerdido.play();
        $("#bgGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);
        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);
        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
        }
    }

    function reposicionaInimigo2() {
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if (fimdejogo == false) {
                $("#bgGame").append("<div id=enemy2></div");
            }
        }
    }

    function reposicionaAmigo() {
        var tempoAmigo = window.setInterval(reposiciona6, 6000);
        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if (fimdejogo == false) {
                $("#bgGame").append("<div id='friend' class='anima-friend'></div>");
            }
        }
    }

    function placar() {
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    }

    //Barra de energia
    function energia() {

        if (energiaAtual == 3) {

            $("#energia").css("background-image", "url(assets/img/energia3.png)");
        }

        if (energiaAtual == 2) {
            $("#energia").css("background-image", "url(assets/img/energia2.png)");
        }

        if (energiaAtual == 1) {
            $("#energia").css("background-image", "url(assets/img/energia1.png)");
        }

        if (energiaAtual == 0) {
            $("#energia").css("background-image", "url(assets/img/energia0.png)");
            gameOver();
        }
    }

    function gameOver() {
        fimdejogo = true;
        musica.pause();
        somGameover.play();

        window.clearInterval(game.timer);
        game.timer = null;

        $("#player").remove();
        $("#enemy1").remove();
        $("#enemy2").remove();
        $("#friend").remove();

        $("#bgGame").append("<div id='fim'></div>");

        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " +
            pontos + "</p>" +
            "<p style='color:darkgreen;'>Salvos: " + salvos + "</p>" +
            "<p style='color:red;'>Perdidos: " + perdidos + "</p>" +
            "<div id='reinicia' onClick=reiniciaJogo()>" +
            "<h3>Jogar Novamente</h3></div>");
    }

}

function reiniciaJogo() {
    somGameover.pause();
    $("#fim").remove();
    start();
}
