/**
 * Created by the-engine team
 * 2017-09-08
 */

var constants = require('../poem/configuration/constants');
var logger = require('../poem/logging/logger4js').helper;

var ServiceResponse = require('../responses/service_response.js');
var IntegerResponse = require('../responses/integer_response.js');
var PlayersResponse = require('../responses/players_response.js');
var TablesResponse = require('../responses/tables_response.js');
var TablesNPlayersRespons = require('../responses/tablesnplayers_response.js');

var playerLogic = require('../work_units/player_logic.js');

var Enums = require('../constants/enums');
var ErrorCode = require('../constants/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/**
 * function :   List tables
 * parameter :
 * return :     TablesResponse
 */
exports.listTables = function (req, res) {
    var tablesResponse = new TablesResponse();

    playerLogic.listTablesWorkUnit(function (listTablesErr, tables) {
        tablesResponse.status = listTablesErr;
        tablesResponse.entity = tables;
        res.send(tablesResponse);
        res.end();
    });
};

/**
 * function :   Get players
 * parameter :
 * return :     raw player list
 */
exports.getPlayers = function (req, res) {
    var tableNumber = req.query.table_number;

    playerLogic.getPlayersWorkUnit(tableNumber, function (getPlayersErr, players) {
        res.send(players);
        res.end();
    });
};

/**
 * function :   List players
 * parameter :
 * return :     PlayerResponse
 */
exports.listPlayers = function (req, res) {
    var tableNumber = req.body.table_number;

    var playersResponse = new PlayersResponse();
    playerLogic.getPlayersWorkUnit(tableNumber, function (getPlayersErr, players) {
        playersResponse.status = getPlayersErr;
        playersResponse.entity = players;
        res.send(playersResponse);
        res.end();
    });
};

/**
 * function :   Update player
 * parameter :  Player object
 * return :     ServiceResponse
 */
exports.updatePlayer = function (req, res) {
    var player = req.body;
    var serviceResponse = new ServiceResponse();

    playerLogic.updatePlayerWorkUnit(player, function (createPlayersErr) {
        serviceResponse.status = createPlayersErr;
        res.send(serviceResponse);
        res.end();
    });
};

/**
 * function :   Delete player
 * parameter :  Player object
 * return :     ServiceResponse
 */
exports.deletePlayer = function (req, res) {
    var player = req.body;
    var serviceResponse = new ServiceResponse();

    playerLogic.deletePlayerWorkUnit(player, function (createPlayersErr) {
        serviceResponse.status = createPlayersErr;
        res.send(serviceResponse);
        res.end();
    });
};

/**
 * function :   Get table by player
 * parameter :  Player name
 * return :     Table number
 */
exports.getTableByPlayer = function (req, res) {
    var playerName = req.body.playerName;
    var integerResponse = new IntegerResponse();

    playerLogic.getTableNumberByPlayerWorkUnit(playerName, function(getTableNumberErr, tableNumber) {
        integerResponse.status = getTableNumberErr;
        integerResponse.entity = tableNumber;
        res.send(integerResponse);
        res.end();
    });
};

/**
 * function :   List kanban
 * parameter :  none
 * return :     Player ranks
 */
exports.listKanban = function (req, res) {
    var playerResponse = new PlayerResponse();

    playerLogic.getAllPlayersOrderedWorkUnit(playerName, function(getTableNumberErr, tableNumber) {
        integerResponse.status = getTableNumberErr;
        integerResponse.entity = tableNumber;
        res.send(integerResponse);
        res.end();
    });
};

/**
 * function :   Dump log
 * parameter :  Table object
 * return :     File redirect
 */
exports.dumpLog = function (req, res) {
    // deprecated
    res.end();
};

/**
 * function :   Get tables
 * parameter :
 * return :     TablesNPlayersResponse
 */
exports.getTables = function (req, res) {
    var tablesNPlayersResponse = new TablesNPlayersRespons();

    playerLogic.getAllTablesWorkUnit(function (getTablesErr, tables) {
        tablesNPlayersResponse.status = getTablesErr;
        tablesNPlayersResponse.entity = tables;
        res.send(tablesNPlayersResponse);
        res.end();
    });
};

