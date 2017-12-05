/**
 * created by Elsie on 2017-11-26
 */

var logger = require('../poem/logging/logger4js').helper;
var playerDao = require('../models/player_dao');
var ErrorCode = require('../constants/error_code.js');
var errorCode = new ErrorCode();

var PlayerAuth = require('../authority/player_auth.js');
var playerAuth = new PlayerAuth(REDIS_HOST, REDIS_PORT, null, REDIS_PASSWORD);

var MD5 = require('../poem/crypto/md5.js');

/**
 * register function
 * @param player: Json format player info
 * @param callback: {errorCode.PLAYER_EXIST, errorCode.SUCCESS, errorCode.FAILED}
 */
exports.registerWorkUnit = function (player, callback) {
    var conditions = {
        phoneNumber: player.phoneNumber
    };
    playerDao.getPlayer(conditions, function (getPlayerErr, players) {
        // take care ! the object getPlayerErr or so contains 2 fields : code & cause,
        // you should compare the someErrorCode.code with the code field of the callback result, not just someErrorCode
        // itself, eg. 'if(getPlayerErr === errorCode.SUCCESS.code)' is NOT correct, however,
        // 'if(getPlayerErr.code === errorCode.SUCCESS.code)' is OK
        logger.info("get players : " + JSON.stringify(getPlayerErr) + ", " + JSON.stringify(players));
        if (getPlayerErr.code === errorCode.SUCCESS.code && players != null && players.length > 0) {
            logger.info("player : " + players[0].phoneNumber + " already exist");
            callback(errorCode.PLAYER_EXIST, null);
        } else {
            // player dose not exist, create one
            logger.info("player not exist, create a new one");
            playerDao.createPlayer(player, function (createPlayerErr, result) {
                logger.info("create player result = " + JSON.stringify(createPlayerErr) + ", " + JSON.stringify(result));
                if (errorCode.SUCCESS.code === createPlayerErr.code && null !== result.ops &&
                    result.ops.length > 0) {
                    // generate token and save to cache
                    var token,
                        key,
                        ttl = 24 * 60 * 60 * 14,
                        timeStamp,
                        player;

                    player = result.ops[0];
                    timeStamp = new Date().getTime();
                    token = MD5.MD5(player.password + timeStamp);
                    key = "player_" + player.phoneNumber;
                    playerAuth.setAuthInfo(key, token, ttl, function (setPlayerAuthErr) {
                        player.token = token;
                        logger.info("save player to cache : " + JSON.stringify(setPlayerAuthErr) + ", " +
                            player);
                        callback(setPlayerAuthErr, player);
                    });
                } else {
                    callback(createPlayerErr, player);
                }
            });
        }
    });
};

exports.getPlayerWorkUnit = function (phoneNumber, password, callback) {
    var conditions = {
        phoneNumber: phoneNumber,
        password: password
    };

    // the DB query condition statement is described using conditions variable,
    // in some cases, the variable does not cover all the fields of the DB
    // table data-structure, eg. if you only want to filter player by phoneNumber
    // the conditions should be { phoneNumber: <some phone number> }
    playerDao.getPlayer(conditions, function (getPlayerErr, players) {
        logger.info("get players result : " + JSON.stringify(getPlayerErr) + ", " + JSON.stringify(players));
        if (getPlayerErr.code === errorCode.SUCCESS.code && players != null && players.length > 0) {
            // generate token and save to cache
            var token,
                key,
                ttl = 24 * 60 * 60 * 14,
                timeStamp,
                player;

            player = players[0];
            timeStamp = new Date().getTime();
            token = MD5.MD5(password + timeStamp);
            key = "player_" + player.phoneNumber;
            playerAuth.setAuthInfo(key, token, ttl, function (setPlayerAuthErr) {
                player.token = token;
                callback(setPlayerAuthErr, player);
            });
        } else {
            // user not exist
            logger.info("player: " + phoneNumber + " not exist");
            callback(errorCode.FAILED, null);
        }
    });
};

exports.verifyTokenWorkUnit = function (id, token, callback) {
    var key = "player_" + id;
    playerAuth.validateAuthInfo(key, token, function (validatePlayerAuthErr, result) {
        if (validatePlayerAuthErr.code !== errorCode.SUCCESS.code) {
            logger.info("token validation failed");
        }
        callback(validatePlayerAuthErr, result);
    });
};
