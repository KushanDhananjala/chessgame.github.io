/**
 * Created by DK
 * `    on 9/11/2017.
 */
$(document).ready(function () {
    var count = 0;
    for (var i = 0; i < col.length; i++) {
        for (var j = 0; j < row.length; j++) {
            var tempId = col[i] + row[j];
            div_ids[count] = tempId;
            count++;
        }
    }
});

// checkmate status
var checkMateStatus = false;

// sound for moves
var dragSound=document.getElementById("drag-audio");
var crossSound=document.getElementById("cross-audio");

// Id s of all divs
var div_ids = [];
// ----------------> side

var col = ["a", "b", "c", "d", "e", "f", "g", "h"];

// up side
var row = ["1", "2", "3", "4", "5", "6", "7", "8"];

//  chessman cross divs ids
var ids_cross_divs = ["cross1", "cross2", "cross3", "cross4", "cross5", "cross6", "cross7", "cross8", "cross9", "cross10",
                        "cross11", "cross12", "cross13", "cross14", "cross15", "cross16", "cross17", "cross18", "cross19",
                        "cross20", "cross21", "cross22", "cross23", "cross24", "cross25", "cross26", "cross27", "cross28",
                        "cross29", "cross30", "cross31", "cross32"];

//  chessmen's div ids
var chesspiece_ids = ["b-l-r", "b-l-k", "b-l-b", "b-a-q", "b-a-king", "b-r-b", "b-r-k", "b-r-r",
                        "b-1-p", "b-2-p", "b-3-p", "b-4-p", "b-5-p", "b-6-p", "b-7-p", "b-8-p",
                        "w-1-p", "w-2-p", "w-3-p", "w-4-p", "w-5-p", "w-6-p", "w-7-p", "w-8-p",
                        "w-l-r", "w-l-k", "w-l-b", "w-a-q", "w-a-king", "w-r-b", "w-r-k", "w-r-r"];

// path of chessman
var path = [];

// if player_trun == true => chance for white
// if player_trun == false => chance for black
var player_trun = "w";

// chess object
var ChessObject = {
    team: "",
    chessmanId: "",
    chessmanParentIdv: ""
};

// set details to the class object
$('.chessPiece').click(function () {
    var chessPiece = $(this).attr("id");
    var chessPieceParent = $(this).parent().attr("id");
    var player = selectPlayer(chessPiece);

    dragSound.play();

    if (!checkMateStatus) {
        if ((checkAnyCrossForChessPiece().length > 0) && (player !== ChessObject.team)) {
            var selectedDivsParent = $(this).parent().attr("id");
            var selectedDiv = $(this).attr("id");
            var team = selectPlayer(selectedDiv);

            // chessPiece movement place one
            if ($("#" + selectedDivsParent).hasClass("cross") && (!selectedDiv.includes("king"))) {
                moveToCrossQueue(chessPiece, team);
                selectCrossedChessPeice(selectedDiv);
                $("#" + ChessObject.chessmanId).appendTo("#" + selectedDivsParent);
                moveToCrossQueue(chessPiece, team);
                removeAllCross();
                removeAllPath();
                findTurnOfPlayer();
                checkMate();
                rotateChessBoard();
            }
        } else {
            removeAllCross();
            removeAllPath();
            ChessObject.chessmanId = chessPiece;
            ChessObject.chessmanParentId = chessPieceParent;
            ChessObject.team = selectPlayer(ChessObject.chessmanId);
            findChessPeice(ChessObject.chessmanId);
        }
    } else {
        alert("Game Over Buddies")
    }
});

// find the crossing chessman index from Chessmans divs id array
function selectCrossedChessPeice(id) {
    for (var i = 0; i < chesspiece_ids.length - 1; i++) {
        if (id === chesspiece_ids[i]) {
            chesspiece_ids.splice(i, 1);
            crossSound.play();
            if (chesspiece_ids[i].includes("w")) {
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
            if ($("#" + ids_cross_divs[i]).children().length === 0) {
                $("#" + id).appendTo($("#" + ids_cross_divs[i]));
                break;
            }
        }
    } else if (team === "w") {
        for (var i = 15; i < ids_cross_divs.length; i++) {
            if ($("#" + ids_cross_divs[i]).children().length === 0) {
                $("#" + id).appendTo($("#" + ids_cross_divs[i]));
                break;
            }
        }
    }
}

// chessman movement place two
// move chessman to selected path
$('.element').click(function () {
    var selectedDiv = $(this).attr("id");
    if (($("#" + selectedDiv).hasClass("path")) && (!selectedDiv.includes("king"))) {
        $("#" + ChessObject.chessmanId).appendTo("#" + selectedDiv);
        dragSound.play();
        removeAllCross();
        removeAllPath();
        findTurnOfPlayer();
        checkMate();
        rotateChessBoard();
    }
});

// find out chessman team
function selectPlayer(id) {
    var details = id.split("-");
    switch (details[0]) {
        case "b":
            return "b";
        case "w":
            return "w";
    }
}

// this fid out the chessman name
function findChessPeice(id) {
    var details = id.split("-");
    if (player_trun === ChessObject.team) {
        switch (details[2]) {
            case "p":
                ChessObject.chessman = "pawn";
                getPawnPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "r":
                ChessObject.chessman = "ruk";
                getRookPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "b":
                ChessObject.chessman = "bishop";
                getBishopPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "k":
                ChessObject.chessman = "knight";
                getKnightPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "king":
                ChessObject.chessman = "king";
                getKingPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "q":
                ChessObject.chessman = "queen";
                getQueenPath(ChessObject.chessmanParentId, ChessObject.team, "queen");
                break;
        }
    } else {
        if ((player_trun === "w") && (checkAnyCrossForChessPiece().length === 0) && (checkAnyPathForChessPiece.length === 0)) {
            alert("This is White Player's Turn");
        } else if ((player_trun === "b") && (checkAnyCrossForChessPiece().length === 0) && (checkAnyPathForChessPiece.length === 0)) {
            alert("This is Black Player's Turn");
        }
    }
}

// find the pawn path to move
function getPawnPath(currentPos, team, from) {
    if (from !== "check") {
        removeAllCross();
        removeAllPath();
    }
    var count = 0;
    if ((currentPos !== null) && (currentPos !== undefined)) {

        // the position with X and Y
        var x = currentPos.substr(0, 1);
        var y = currentPos.substr(1, 1);

        var xIndex = getPositionOfX(x);
        var yIndex = getPositionOfY(y);

        // check movement divs for white pawns
        if (team === "w") {
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
                    var content = $('.chessPiece').attr("id");
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
                    var team = selectPlayer(id);
                    if (team === "b") {
                        $("#" + col[xIndex + 1] + row[yIndex + 1]).addClass("cross");
                        // removeALlPath();
                    }
                }
                if ($("#" + col[xIndex - 1] + row[yIndex + 1]).children().length > 0) {
                    var id = $("#" + col[xIndex - 1] + row[yIndex + 1]).children().attr("id");
                    var team = selectPlayer(id);
                    if (team === "b") {
                        $("#" + col[xIndex - 1] + row[yIndex + 1]).addClass("cross");
                        // removeALlPath();
                    }
                }
            }
            // check movement divs for black pawns
        } else {
            for (var j = row.length; j > 0; j--) {
                // check it is the first movement for pawn
                // if it is the first select first two divs
                if (y === "7") {
                    if ($("#" + x + "6").children().length === 0) {
                        $("#" + x + "6").addClass("path");
                        if ($("#" + x + "5").children().length === 0) {
                            $("#" + x + "5").addClass("path");
                            //removeAllCross();
                        }
                    }
                    // if it is not the first movement looking for a div to move
                } else {
                    var content = $('.chessPiece').attr("id");
                    if ((content !== null) && (content !== undefined)) {
                        if ((count < 1) && ($("#" + x + (row[yIndex - 1])).children().length === 0)) {
                            $("#" + x + (row[yIndex - 1])).addClass("path");
                            //removeAllCross();
                            count++;
                        }
                    }
                }

                if ($("#" + col[xIndex + 1] + row[yIndex - 1]).children().length > 0) {
                    var id = $("#" + col[xIndex + 1] + row[yIndex - 1]).children().attr("id");
                    var team = selectPlayer(id);
                    if (team === "w") {
                        $("#" + col[xIndex + 1] + row[yIndex - 1]).addClass("cross");
                        // removeALlPath();
                    }
                }
                if ($("#" + col[xIndex - 1] + row[yIndex - 1]).children().length > 0) {
                    var id = $("#" + col[xIndex - 1] + row[yIndex - 1]).children().attr("id");
                    var team = selectPlayer(id);
                    if (team === "w") {
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
function getRookPath(currentPos, team, from) {
    if (from !== "queen") {
        removeAllCross();
        removeAllPath();
    }

    var pathArray = [];
    var crossArray = [];
    var check = [];
    var content = $('.chessPiece').attr("id");

    if ((content !== null) && (content !== undefined)) {
        if ((currentPos !== null) && (currentPos !== undefined)) {

            // the position with x and y
            var x = currentPos.substr(0, 1);
            var y = currentPos.substr(1, 1);

            var xIndex = getPositionOfX(x);
            var yIndex = getPositionOfY(y);

            // check movement ======> side path
            for (var i = xIndex + 1; i < row.length; i++) {
                if ($("#" + col[i] + row[yIndex]).children().length === 0) {
                    pathArray.push($("#" + col[i] + row[yIndex]).attr("id"));
                }
                if ($("#" + col[i] + row[yIndex]).children().length > 0) {
                    if (selectPlayer($("#" + col[i] + row[yIndex]).children().attr("id")) !== team) {
                        if (from !== "check") {
                            crossArray.push($("#" + col[i] + row[yIndex]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[i] + row[yIndex]).children().attr("id").includes("king")) {
                                check.push($("#" + col[i] + row[yIndex]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
            }

            // check movement <====== side path
            for (var i = xIndex - 1; i > -1; i--) {
                if ($("#" + col[i] + row[yIndex]).children().length === 0) {
                    pathArray.push($("#" + col[i] + row[yIndex]).attr("id"));
                }
                if ($("#" + col[i] + row[yIndex]).children().length > 0) {
                    if (selectPlayer($("#" + col[i] + row[yIndex]).children().attr("id")) !== team) {
                        if (from !== "check") {
                            crossArray.push($("#" + col[i] + row[yIndex]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[i] + row[yIndex]).children().attr("id").includes("king")) {
                                check.push($("#" + col[i] + row[yIndex]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
            }

            // look path for up side
            for (var i = yIndex + 1; i < col.length; i++) {
                if ($("#" + col[xIndex] + row[i]).children().length === 0) {
                    pathArray.push($("#" + col[xIndex] + row[i]).attr("id"));
                }
                if ($("#" + col[xIndex] + row[i]).children().length > 0) {
                    if (selectPlayer($("#" + col[xIndex] + row[i]).children().attr("id")) !== team) {
                        if (from !== "check") {
                            crossArray.push($("#" + col[xIndex] + row[i]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[xIndex] + row[i]).children().attr("id").includes("king")) {
                                check.push($("#" + col[xIndex] + row[i]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
            }
            //look path for down side
            for (var i = yIndex - 1; i > -1; i--) {
                if ($("#" + col[xIndex] + row[i]).children().length === 0) {
                    pathArray.push($("#" + col[xIndex] + row[i]).attr("id"));
                }
                if ($("#" + col[xIndex] + row[i]).children().length > 0) {
                    if (selectPlayer($("#" + col[xIndex] + row[i]).children().attr("id")) !== team) {
                        if (from !== "check") {
                            crossArray.push($("#" + col[xIndex] + row[i]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[xIndex] + row[i]).children().attr("id").includes("king")) {
                                check.push($("#" + col[xIndex] + row[i]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
            }
        }
        if (from !== "check") {
            colorCrossPath(crossArray);
            colorChessPeicePath(pathArray);
        } else {
            return check;
        }
    }
}

// this is common method for both queen and bishop
// find path for bishop
function getBishopPath(currentPos, team, from) {
    if (from !== "queen") {
        removeAllCross();
        removeAllPath();
    }
    var pathArray = [];
    var crossArray = [];
    var check = [];

    var content = $('.chessPiece').attr("id");
    if ((content !== null) && (content !== undefined)) {
        if ((currentPos !== null) && (currentPos !== undefined)) {

            // the position with x and y
            var x = currentPos.substr(0, 1);
            var y = currentPos.substr(1, 1);

            var xIndex = getPositionOfX(x);
            var yIndex = getPositionOfY(y);

            // look path for right upper side
            var count = 1;
            for (var i = xIndex + 1; i < col.length; i++) {
                if ($("#" + col[i] + row[yIndex + count]).children().length === 0) {
                    pathArray.push($("#" + col[i] + row[yIndex + count]).attr("id"));
                }
                if ($("#" + col[i] + row[yIndex + count]).children().length > 0) {
                    if (selectPlayer($("#" + col[i] + row[yIndex + count]).children().attr("id")) !== team) {
                        if (from !== "check") {
                            crossArray.push($("#" + col[i] + row[yIndex + count]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[i] + row[yIndex + count]).children().attr("id").includes("king")) {
                                check.push($("#" + col[i] + row[yIndex + count]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
                count++;
            }
            count = 1;

            // look path for left upper side
            for (var i = xIndex - 1; i > -1; i--) {
                if ($("#" + col[i] + row[yIndex + count]).children().length === 0) {
                    pathArray.push($("#" + col[i] + row[yIndex + count]).attr("id"));
                }
                if ($("#" + col[i] + row[yIndex + count]).children().length > 0) {
                    if (selectPlayer($("#" + col[i] + row[yIndex + count]).children().attr("id")) !== team) {
                        if (from !== "check") {
                            crossArray.push($("#" + col[i] + row[yIndex + count]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[i] + row[yIndex + count]).children().attr("id").includes("king")) {
                                check.push($("#" + col[i] + row[yIndex + count]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
                count++;
            }
            count = 1;

            // look path for right down side
            for (var i = xIndex + 1; i < row.length; i++) {
                if ($("#" + col[i] + row[yIndex - count]).children().length > 0) {
                    if (selectPlayer($("#" + col[i] + row[yIndex - count]).children().attr("id")) !== team) {
                        crossArray.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                        if (from !== "check") {
                            crossArray.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[i] + row[yIndex - count]).children().attr("id").includes("king")) {
                                check.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                } else {
                    pathArray.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                }
                count++;
            }

            count = 1;
            // look path for left down side
            for (var i = xIndex - 1; i > -1; i--) {
                if ($("#" + col[i] + row[yIndex - count]).children().length > 0) {
                    if (selectPlayer($("#" + col[i] + row[yIndex - count]).children().attr("id")) !== team) {
                        crossArray.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                        if (from !== "check") {
                            crossArray.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[i] + row[yIndex - count]).children().attr("id").includes("king")) {
                                check.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                } else {
                    pathArray.push($("#" + col[i] + row[yIndex - count]).attr("id"));
                }
                count++;
            }
        }
    }
    if (from !== "check") {
        colorCrossPath(crossArray);
        colorChessPeicePath(pathArray);
    } else {
        return check;
    }
}

// this is method for find queens path
function getQueenPath(currentPos, team, form) {
    getBishopPath(ChessObject.chessmanParentId, ChessObject.team, form);
    getRookPath(ChessObject.chessmanParentId, ChessObject.team, form);
}

// this is method for find kings path
function getKingPath(currentPos, team, from) {
    removeAllCross();
    removeAllPath();

    var pathArray = [];
    var crossArray = [];
    var check = [];

    var content = $('.chessPiece').attr("id");
    if ((content !== null) && (content !== undefined)) {
        if ((currentPos !== null) && (currentPos !== undefined)) {

            // the position with x and y
            var x = currentPos.substr(0, 1);
            var y = currentPos.substr(1, 1);

            var xIndex = getPositionOfX(x);
            var yIndex = getPositionOfY(y);

            for (var i = 0; i < div_ids.length; i++) {
                var tempX = div_ids[i].substr(0, 1);
                var tempY = div_ids[i].substr(1, 1);

                var newX = getPositionOfX(tempX);
                var newY = getPositionOfY(tempY);

                if ((Math.abs(newX - xIndex) <= 1) && (Math.abs(newY - yIndex) <= 1)) {
                    if ($("#" + div_ids[i]).children().length > 0) {
                        if (selectPlayer($("#" + div_ids[i]).children().attr("id")) !== team) {
                            if (from !== "check") {
                                crossArray.push($("#" + div_ids[i]).attr("id"));
                            } else {
                                if ($("#" + div_ids[i]).children().attr("id").includes("king")) {
                                    check.push($("#" + div_ids[i]).attr("id"));
                                    break;
                                }
                            }
                        }
                    }
                    if ($("#" + div_ids[i]).children().length === 0) {
                        pathArray.push($("#" + div_ids[i]).attr("id"));
                    }
                }
            }
            if (from !== "check") {
                colorCrossPath(crossArray);
                colorChessPeicePath(pathArray);
            } else {
                return check;
            }
        }
    }
}


// this method use to find knight path
function getKnightPath(currentPos, team, from) {
    removeAllCross();
    removeAllPath();

    var pathArray = [];
    var crossArray = [];
    var check = [];

    var content = $('.chessPiece').attr("id");
    if ((content !== null) && (content !== undefined)) {
        if ((currentPos !== null) && (currentPos !== undefined)) {

            // the position with x and y
            var x = currentPos.substr(0, 1);
            var y = currentPos.substr(1, 1);

            var xIndex = getPositionOfX(x);
            var yIndex = getPositionOfY(y);

            for (var i = 0; i < div_ids.length; i++) {
                var tempX = div_ids[i].substr(0, 1);
                var tempY = div_ids[i].substr(1, 1);

                var newX = getPositionOfX(tempX);
                var newY = getPositionOfY(tempY);

                if (((Math.abs(xIndex - newX) === 1) && ((Math.abs(yIndex - newY)) === 2)) | (((Math.abs(xIndex - newX) === 2)) && ((Math.abs(yIndex - newY)) === 1))) {
                    if ($("#" + div_ids[i]).children().length > 0) {
                        if (selectPlayer($("#" + div_ids[i]).children().attr("id")) !== team) {
                            if (from !== "check") {
                                crossArray.push($("#" + div_ids[i]).attr("id"));
                            } else {
                                if ($("#" + div_ids[i]).children().attr("id").includes("king")) {
                                    check.push($("#" + div_ids[i]).attr("id"));
                                    break;
                                }
                            }
                        }
                    }
                    if ($("#" + div_ids[i]).children().length === 0) {
                        pathArray.push($("#" + div_ids[i]).attr("id"));
                    }
                }
            }
        }
        if (from !== "check") {
            colorCrossPath(crossArray);
            colorChessPeicePath(pathArray);
        } else {
            return check;
        }
    }
}

// to color the path
function colorChessPeicePath(path) {
    for (var i = 0; i < path.length; i++) {
        $("#" + path[i]).addClass("path");
    }
}

// to color the cross path
function colorCrossPath(cross) {
    for (var i = 0; i < cross.length; i++) {
        $("#" + cross[i]).addClass("cross");
    }
}

// to get x index
function getPositionOfX(x) {
    for (var i = 0; i < col.length; i++) {
        if (x === col[i]) {
            return i;
        }
    }
}

// to get y index
function getPositionOfY(y) {
    for (var i = 0; i < row.length; i++) {
        if (y === row[i]) {
            return i;
        }
    }
}

// to remove the all path
function removeAllPath() {
    for (var i = 0; i < div_ids.length; i++) {
        $("#" + div_ids[i]).removeClass("path");
    }
}

// to remove the all cross
function removeAllCross() {
    for (var i = 0; i < div_ids.length; i++) {
        $("#" + div_ids[i]).removeClass("cross");
    }
}

// to check the crossing for path
function checkAnyCrossForChessPiece() {
    var count = 0;
    var crossArray = new Array();
    for (var i = 0; i < div_ids.length; i++) {
        if ($("#" + div_ids[i]).hasClass("cross")) {
            crossArray.push(div_ids[i]);
            count++;
        }
    }
    return crossArray;
}

// to get all selected path
function checkAnyPathForChessPiece() {
    var count = 0;
    var pathArray = new Array();
    for (var i = 0; i < div_ids.length; i++) {
        if ($("#" + div_ids[i]).hasClass("cross")) {
            pathArray.push(div_ids[i]);
            count++;
        }
    }
    return pathArray;
}

// to select the player_trun
function findTurnOfPlayer() {
    if (player_trun === "w") {
        player_trun = "b";
    } else {
        player_trun = "w";
    }
}

// to rotate chess board
function rotateChessBoard() {
    $('#board').toggleClass('rotate');
    rotateIdDivs()
    rotateChessPiece();
}

// to rotate chessman
function rotateChessPiece() {
    for (var i = 0; i < chesspiece_ids.length; i++) {
        $("#" + chesspiece_ids[i]).toggleClass('rotate');
    }
}

function rotateIdDivs() {
    $('.div-letter').toggleClass('rotate');
    $('.div-number').toggleClass('rotate');
}

// to check checkmate
function checkMate() {

}