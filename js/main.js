$(document).ready(function(){

    $("#sidebar h1").hide();
    $("#sidebar p").hide();
    $(".chiel").hide();
    $(".tim").hide();
    $(".yanni").hide();
    $("#sidebarbtnQuit").hide();

    var sidebar = 0;

    $("#sidebarbtn").hover(function(){
        if(sidebar == 0){
            $(this).attr("src", "img/sidebar1.png");
        } else{
            $(this).attr("src", "img/sidebar1Quit.png");
        }
    })

    $("#sidebarbtn").mouseout(function(){
        if(sidebar == 0){
            $(this).attr("src", "img/sidebar1hollow.png");
        } else{
            $(this).attr("src", "img/sidebar1hollowQuit.png");
        }
    })

    $("#sidebarbtn").click(function(){

        switch(sidebar){
            case 0:
                $("#sidebar").css("width", "100%");
                $("#sidebar h1").fadeIn(1000);
                $("#sidebar p").fadeIn(1000);
                $(".chiel").fadeIn(2000);
                $(".tim").fadeIn(2500);
                $(".yanni").fadeIn(3000);
                $(this).css("left", "1400px");
                $(this).attr("src", "sidebar1hollowQuit.png");
                sidebar = 1;
                break;
            case 1:
                $("#sidebar h1").fadeOut("fast");
                $("#sidebar p").fadeOut("fast");
                $(".yanni").fadeOut("fast");
                $(".tim").fadeOut("fast");
                $(".chiel").fadeOut("fast");
                $("#sidebar").css("width", "0%");
                $(this).css("left", "50px");
                $(this).attr("src", "sidebar1hollow.png");
                sidebar = 0;
                break;
        }
    })
})