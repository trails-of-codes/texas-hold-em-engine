/**
 * created by Dummy team
 * 2017-12-02
 */

var logger = require('../poem/logging/logger4js').helper;
var BoardResponse = require('../responses/board_response');
var BoolResponse = require('../responses/bool_response');
var boardLogic = require('../work_units/board_logic');

/**
 * create a new board instance by creator with phoneNumber, gameName
 * @param req
 * @param res
 */
exports.createBoard = function (req, res) {
    var creator = req.body.phoneNumber;
    var gameName = req.body.gameName;

    var boardResponse = new BoardResponse();
    boardLogic.createBoardWorkUnit(creator, gameName, function (createBoardErr, board) {
        boardResponse.status = createBoardErr;
        boardResponse.entity = board;
        res.send(boardResponse);
        res.end();
    });
};


/**
 * update a board by ticket,gameName and new board value
 * @param req
 * @param res
 */
exports.updateBoard = function (req, res) {
    var ticket = req.body.ticket;
    var gameName = req.body.gameName;
    var newBoard = req.body.newBoard;

    var boardResponse = new BoardResponse();
    boardLogic.updateBoardWorkUnit(ticket, gameName, newBoard, function (updateBoardErr, board) {
        boardResponse.status = updateBoardErr;
        boardResponse.entity = board;
        res.send(boardResponse);
        res.end();
    });
};


/**
 * list boards by status, gameName
 * @param req
 * @param res
 */
exports.listBoards = function (req, res) {
    var status = req.body.status;
    var gameName = req.body.gameName;

    var boardResponse = new BoardResponse();
    boardLogic.listBoardsWorkUnit(status, gameName, function (listBoardsErr, boards) {
        boardResponse.status = listBoardsErr;
        boardResponse.entity = boards;
        res.send(boardResponse);
        res.end();
    });
};


/**
 * list boards by status, gameName
 * @param req
 * @param res
 */
exports.listActiveBoards = function (req, res) {
    var gameName = req.body.gameName;
    var from = req.body.from || 0;
    var count = req.body.count || 0;
    var searchName = req.body.searchName;

    var boardResponse = new BoardResponse();
    boardLogic.listActiveBoardsWorkUnit(gameName, from, count, searchName, function (listBoardsErr, boards) {
        boardResponse.status = listBoardsErr;
        boardResponse.entity = boards;
        res.send(boardResponse);
        res.end();
    });
};


/**
 * to confirm it is a creator board
 * @param req
 * @param res
 */
exports.isCreatorBoard = function (req, res) {
    var token = req.body.token;
    var ticket = req.body.ticket;

    logger.info("isCreatorBoard call, token = " + token + ", ticket = " + ticket);
    var boolResponse = new BoolResponse();
    boardLogic.isCreatorBoardWorkUnit(token, ticket, function (getBoardErr, result) {
        boolResponse.status = getBoardErr;
        boolResponse.entity = result;
        res.send(boolResponse);
        res.end();
    });
};


// for testing
/*
exports.getBoardByTicket = function (req,res){
    var ticket = req.body.ticket;
    var gameName = req.body.game_name;

    var boardResponse = new BoardResponse();
    boardLogic.getBoardByTicketWorkUnit(ticket,gameName, function (getBoardErr, board) {
        boardResponse.status = getBoardErr;
        boardResponse.entity = board;
        res.send(boardResponse);
        res.end();
    });
};
*/


