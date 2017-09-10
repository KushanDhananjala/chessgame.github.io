/**
 * Created by DK on 9/8/2017.
 */
console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
var letters=["a","b","c","d","e","f","g","h"];
var numbers=[1,2,3,4,5,6,7,8];
var currentPiece;
var tiles;
var pices;
var whitedraggable;
var blackdraggable;
var pawncount;

$(document).ready(function () {
    tiles=$(".square");
    pices=$(".chessPiece");
    whitedraggable=true;
    blackdraggable=false;
    pawncount=0;
});


$('.whitepawn').click(function (eventData) {
    currentPiece = $(this);
    console.log(currentPiece);

    if (!(currentPiece.hasClass('afterClickPieces')) && currentPiece.hasClass('whitepawn')) {
        pathOfWhitePawn(currentPiece);
        console.log("whitepawn");
    }
});

$('.blackpawn').click(function (eventData) {
 currentPiece = $(this);
 console.log(currentPiece);

    if (!(currentPiece.hasClass('afterClickPieces')) && currentPiece.hasClass('blackpawn')) {
        pathOfBackPawn(currentPiece);
        console.log("blackpawn");
    }
 });


 function pathOfBackPawn(eventData) {
     currentPiece=eventData;
     tiles.removeClass("selectPath");
     console.log("pathOfBlackPawn");
     console.log(currentPiece);

     console.log("chess piece id"+chesspieceid);
     var currID= currentPiece.parent().attr('id');
     console.log("currID"+currID);
     var firstLetter=currID.charAt(0);
     var firstNumber=currID.charAt(1);
     var chesspieceid=currentPiece.children('img').attr('id');
     var stringArrayPosition=($.inArray(firstLetter, letters));
     var numberArrayPosition=($.inArray(parseInt(firstNumber), numbers));
     console.log("stringArrayPosition"+stringArrayPosition);
     console.log("numberArrayPosition"+numberArrayPosition);
     var tempID=letters[stringArrayPosition]+numbers[numberArrayPosition +1];

     var i=stringArrayPosition;
     var j=2;

     console.log("j ="+j);

     for(;j<4;j++){
         tempID=letters[i]+numbers[j];
         console.log("forLoop"+tempID);
         if(!($('#'+tempID).hasClass('chessPiece'))){
         $('#'+tempID).addClass('selectPath');
         currentPiece.addClass('afterClickPieces');
         }else{
            break;
        }
     }
 }

function pathOfWhitePawn(eventData) {
    currentPiece=eventData;
    tiles.removeClass("selectPath");
    console.log("pathOfWhitePawn");
    console.log(currentPiece);

    console.log("chess piece id"+chesspieceid);
    var currID= currentPiece.parent().attr('id');
    console.log("currID"+currID);
    var firstLetter=currID.charAt(0);
    var firstNumber=currID.charAt(1);
    var chesspieceid=currentPiece.children('img').attr('id');
    var stringArrayPosition=($.inArray(firstLetter, letters));
    var numberArrayPosition=($.inArray(parseInt(firstNumber), numbers));
    console.log("stringArrayPosition"+stringArrayPosition);
    console.log("numberArrayPosition"+numberArrayPosition);
    var tempID=letters[stringArrayPosition]+numbers[numberArrayPosition +1];

    var i=stringArrayPosition;
    var j=numberArrayPosition+1;

    console.log("j = "+j);

    for(;j<4;j++){
        tempID=letters[i]+numbers[j];
        console.log("forLoop "+tempID);
        if(!($('#'+tempID).hasClass('chessPiece'))){
            $('#'+tempID).addClass('selectPath');
            currentPiece.addClass('afterClickPieces');
        }else{
            break;
        }
    }
}

$(".square").click(function () {
    var currentSquare=$(this);
    var currPiece=$(".chessPiece.afterClickPieces");
    if($(currentSquare).hasClass('selectPath')){
        currentSquare.append(currPiece);
        pices.removeClass('afterClickPieces');
        tiles.removeClass('selectPath');
    }
});