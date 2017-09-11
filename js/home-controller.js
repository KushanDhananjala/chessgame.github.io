/**
 * Created by DK on 9/11/2017.
 */
$(document).ready(function () {
    var count = 0;
    for (var i = 0; i < col.length; i++) {
        for (var j = 0; j < row.length; j++) {
            var tempId = col[i] + row[j];
            DIV_IDS[count] = tempId;
            count++;
        }
    }
});

// checkmate status
var checkMateStatus = false;
// Id s of all divs
var DIV_IDS = [];
// ----------------> side
var col = ["a", "b", "c", "d", "e", "f", "g", "h"];

// up side
var row = ["1", "2", "3", "4", "5", "6", "7", "8"];

//  chessmen's div ids
var CHESSMANS_IDS = ["b-l-r", "b-l-k", "b-l-b", "b-a-q", "b-a-king", "b-r-b", "b-r-k", "b-r-r",
    "b-1-p", "b-2-p", "b-3-p", "b-4-p", "b-5-p", "b-6-p", "b-7-p", "b-8-p",
    "w-1-p", "w-2-p", "w-3-p", "w-4-p", "w-5-p", "w-6-p", "w-7-p", "w-8-p",
    "w-l-r", "w-l-k", "w-l-b", "w-a-q", "w-a-king", "w-r-b", "w-r-k", "w-r-r"];

//  chessman cross divs ids
var CROSS_DIV_IDS = ["cr1", "cr2", "cr3", "cr4", "cr5", "cr6", "cr7", "cr8", "cr9", "cr10", "cr11", "cr12",
    "cr13", "cr14", "cr15", "cr16", "cr17", "cr18", "cr19", "cr20", "cr21", "cr22", "cr23", "cr24", "cr25", "cr26",
    "cr27", "cr28", "cr29", "cr30", "cr31", "cr32"];

// path of chessman
var pat = [];

// if turn == true => chance for white
// if turn == false => chance for black
var turn = w;

// chess object
var ChessObject = {
    team: "",
    chessmanId: "",
    chessmanParentIdv: ""
};

// set details to the class object
$("div > div > div > div > div > div").click(function () {
    var chessman = $(this).attr("id");
    var chessmanParent = $(this).parent().attr("id");
    var team = checkTeam(chessman);

    if (!checkMateStatus) {
        if ((checkAnyCrossing().length > 0) && (team != ChessObject.team)) {
            var selectedDivsParent = $(this).parent().attr("id");
            var selectedDiv = $(this).attr("id");
            var team = checkTeam(selectedDiv);

            // chessman movement place one
            if ($("#" + selectedDivsParent).hasClass("cross") && (!selectedDiv.includes("king"))) {
                moveToCrossQueue(chessman, team);
                findCrossedChessman(selectedDiv);
                $("#" + ChessObject.chessmanId).append("#" + selectedDivsParent);
                moveToCrossQueue(chessman, team);
                removeAllCross();
                removeAllPath();
                findTurn();
                checkMate();
                turnChessBoard();
            }
        } else {
            removeAllCross();
            removeAllPath();
            ChessObject.chessmanId = chessman;
            ChessObject.chessmanParentId = chessmanParent;
            ChessObject.team = checkTeam(ChessObject.chessmanId);
            findName(ChessObject.chessmanId);
        }
    } else {
        alert("Game Over Buddies")
    }
});

// find the crossing chessman index from Chessmans divs id array
function findCrossedChessman(id) {
    for (var i = 0; i < CHESSMANS_IDS.length; i++) {
        if (id === CHESSMANS_IDS[i]) {
            CHESSMANS_IDS.splice(i, 1);
            if (CHESSMANS_IDS[i].includes("w")) {
                $("#" + id).toggleClass('rotate');
            }
            break;
        }
    }
}

// add cross chessmans to cross queue
function moveToCrossQueue(id, team) {
    if (team === "b") {
        for (var i = 0; i < 15; i++) {
            if ("#" + CROSS_DIV_IDS[i].children().length == 0) {
                $("#" + id).appendTo($("#" + CROSS_DIV_IDS[i]));
                break;
            }
        }
    } else if (team === "w") {
        for (var i = 0; i < 15; i++) {
            if ("#" + CROSS_DIV_IDS[i].children().length == 0) {
                $("#" + id).appendTo($("#" + CROSS_DIV_IDS[i]));
                break;
            }
        }
    }
}

// chessman movement place two
// move chessman to selected path
$("div > div > div > div > div > div").click(function () {
    var selectedDiv = $(this).attr("id");
    if (($("#" + selectedDiv).hasClass("path")) && (!selectedDiv.includes("king"))) {
        $("#" + ChessObject.chessmanId).appendTo("#" + selectedDiv);
        removeAllCross();
        removeAllPath();
        findTurn();
        checkMate();
        turnChessBoard();
    }
});

// find out chessman team
function checkTeam(id) {
    var details = id.split("-");
    // this find chessman team
    switch (details[0]) {
        case "b":
            return "b";
        case "w":
            return "w";
    }
}

// this fid out the chessman name
function findName(id) {
    var details = id.split("-");
    if (turn === ChessObject.team) {
        switch (details[2]) {
            case "p":
                ChessObject.chessman = "pawn";
                findPawnPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "r":
                ChessObject.chessman = "pawn";
                findRuckPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "b":
                ChessObject.chessman = "pawn";
                findBishopPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "k":
                ChessObject.chessman = "pawn";
                findKnightPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "king":
                ChessObject.chessman = "pawn";
                findKingPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "q":
                ChessObject.chessman = "pawn";
                findQueenPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
        }
    } else {
        if ((turn === "w") && (checkAnyCrossing().length === 0) && (checkAnyPath.length === 0)) {
            alert("This is White Player's Turn");
        } else if ((turn === "b") && (checkAnyCrossing().length === 0) && (checkAnyPath.length === 0)) {
            alert("This is Black Player's Turn");
        }
    }
}

// find the pawn path to move
function findPawnPath(currentPos, team, from) {
    if (from !== "check") {
        removeAllCross();
        removeAllPath();
    }
    var count = 0;
    if ((currentPos !== null) && (currentPos !== undefined)) {

        // the position with X and Y
        var x = currentPos.substr(0, 1);
        var y = currentPos.substr(1, 1);

        var xIndex = getXIndex(x);
        var yIndex = getYIndex(y);

        // check movement divs for white pawns
        if (team === "w ") {
            for (var j = 0; j < row.length; j++) {
                // check it is the first movement for pawn
                // if it is the first select first two divs
                if ((y === "2")) {
                    if ($("#" + x + "3").children().length === 0) {
                        $("#" + x + "3").addClass("path");
                        if ($("#" + x + "4").children().length === 0) {
                            $("#" + x + "4").addClass("path");
                            //removeAllCross();
                        }
                    }
                    // if it is not the first movement looking for a div to move
                } else {
                    var content = $("div > div > div > div > div > div").attr("id");
                    if ((content !== null) && (content !== undefined)) {
                        if ((count < 1) && ($("#" + x + (row[yIndex + 1])).children().length === 0)) {
                            $("#" + x + (row[yIndex + 1])).addClass("path");
                            //removeAllCross();
                            count++;
                        }
                    }
                }

                if ($("#" + col[xIndex + 1] + row[yIndex + 1]).children().length > 0) {
                    var id = $("#" + col[xIndex + 1] + row[yIndex + 1]).children().attr("id");
                    var team = chechTeam(id);
                    if (team === "b") {
                        $("#" + col[xIndex + 1] + row[yIndex + 1]).addClass("cross");
                        // removeALlPath();
                    }
                }
                if ($("#" + col[xIndex - 1] + row[yIndex + 1]).children().length > 0) {
                    var id = $("#" + col[xIndex - 1] + row[yIndex + 1]).children().attr("id");
                    var team = chechTeam(id);
                    if (team === "b") {
                        $("#" + col[xIndex - 1] + row[yIndex + 1]).addClass("cross");
                        // removeALlPath();
                    }
                }
            }
            // check movement divs for black pawns
        } else {
            for (var j = 0; j < row.length; j++) {
                // check it is the first movement for pawn
                // if it is the first select first two divs
                if ((y === "7")) {
                    if ($("#" + x + "6").children().length === 0) {
                        $("#" + x + "6").addClass("path");
                        if ($("#" + x + "5").children().length === 0) {
                            $("#" + x + "5").addClass("path");
                            //removeAllCross();
                        }
                    }
                    // if it is not the first movement looking for a div to move
                } else {
                    var content = $("div > div > div > div > div > div").attr("id");
                    if ((content !== null) && (content !== undefined)) {
                        if ((count < 1) && ($("#" + x + (row[yIndex - 1])).children().length === 0)) {
                            $("#" + x + (row[yIndex + 1])).addClass("path");
                            //removeAllCross();
                            count++;
                        }
                    }
                }

                if ($("#" + col[xIndex + 1] + row[yIndex - 1]).children().length > 0) {
                    var id = $("#" + col[xIndex + 1] + row[yIndex - 1]).children().attr("id");
                    var team = chechTeam(id);
                    if (team === "w") {
                        $("#" + col[xIndex + 1] + row[yIndex - 1]).addClass("cross");
                        // removeALlPath();
                    }
                }
                if ($("#" + col[xIndex - 1] + row[yIndex - 1]).children().length > 0) {
                    var id = $("#" + col[xIndex - 1] + row[yIndex - 1]).children().attr("id");
                    var team = chechTeam(id);
                    if (team === "b") {
                        $("#" + col[xIndex - 1] + row[yIndex - 1]).addClass("cross");
                        // removeALlPath();
                    }
                }
            }
        }
    }
}

// this method is common for both queen and ruck
// find the ruck path to move
function findRuckPath(currentPos,team,from) {
    if(from!=="queen"){
        removeAllCross();
        removeAllPath();
    }

    var pathArray=[];
    var crossArray=[];
    var check=[];
    var content=$("div > div > div > div > div > div").attr("id");

    if((content!==null)&&(content!==undefined)){
        if((currentPos!==null)&& (currentPos!==undefined)){

            // the position with x and y
            var x=currentPos.substr(0,1);
            var y=currentPos.substr(1,1);

            var xIndex=getXIndex(x);
            var yIndex=getYIndex(y);

            // check movement divs for white rucks

        }
    }
}