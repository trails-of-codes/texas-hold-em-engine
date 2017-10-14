/**
 * Created by the-engine-team
 * 2017-10-03
 */

var BoardLayer = cc.Layer.extend({

    // constants
    defaultFont: 'Tw Cen MT',
    roundTextFont: 'IMPACT',
    roundTextSize: '36',
    authorTextFont: 'Tw Cen MT',
    authorTextSize: '14',
    boardTextFont: 'Tw Cen MT',
    boardTextSize: '18',
    betTextFont: 'IMPACT',
    betTextSize: '24',
    amountTextFont: 'IMPACT',
    amountTextSize: '32',
    debug: true,
    maxPlayerCount: 10,
    maxPublicCardCount: 5,

    // game model variables
    size: null,
    validWidth: 0,
    validHeight: 0,
    publicCardsModel: [],

    // scales
    gameScale: 1.0,
    bgScale: 1.0,
    decoScale: 1.0,
    boardScale: 1.0,
    mmScale: 1.0,
    logoScale: 1.0,
    playerScale: 1.0,
    cardScale: 1.0,
    controlMenuScale: 1.0,
    operationButtonScale: 1.0,

    // sprites
    bgSprite: null,
    decoBottom: null,
    bgBoard: null,
    bgMM: null,
    publicCards: [],
    tmLogo: null,
    bgBet: null,
    yourTurn: null,

    // labels
    roundLabel: null,
    boardLabel: null,
    betLabel: null,
    authorLabel: null,
    amountLabel: null,

    // buttons
    startButton: null,
    stopButton: null,
    callButton: null,
    checkButton: null,
    raiseButton: null,
    foldButton: null,
    allinButton: null,
    betButton: null,
    betSpinnerUp: null,
    betSpinnerDown: null,

    // menus

    // layers
    playerLayers: [],
    dealerLayer: null,
    winnerLayer: null,

    // design specs
    refWidth: 1024,
    refHeight: 768,
    boardMarginLeft: 28,
    boardMarginRight: 28,
    boardMarginBottom: 180,
    mmMarginTop: 20,
    playerPosition: [
        // players at right side
        { x: 640, y: 580, chipsYFix: -40, chipsXFix: 0 },
        { x: 840, y: 500, chipsYFix: 0, chipsXFix: 0 },
        { x: 860, y: 340, chipsYFix: 0, chipsXFix: 0 },
        { x: 840, y: 180, chipsYFix: 40, chipsXFix: -30 },
        { x: 600, y: 80, chipsYFix: 160, chipsXFix: 120 },
        // players at left side
        { x: 280, y: 80, chipsYFix: 160, chipsXFix: -120 },
        { x:  40, y: 180, chipsYFix: 40, chipsXFix: 30 },
        { x:  10, y: 340, chipsYFix: 0, chipsXFix: 0 },
        { x:  40, y: 500, chipsYFix: 0, chipsXFix: 0 },
        { x: 230, y: 580, chipsYFix: -40, chipsXFix: 0 }
    ],
    cardVisualHeight: 100,
    cardVisualWidth: 72,
    cardMarginBottom: 280,
    cardMarginLeft: [320, 400, 480, 560, 640],
    roundTextWidth: 640,
    roundTextHeight: 50,
    roundTextMarginBottom: 460,
    boardTextWidth: 640,
    boardTextHeight: 48,
    boardTextMarginBottom: 360,
    betTextMarginBottom: 400,
    authorTextWidth: 340,
    authorTextHeight: 48,
    authorTextMarginBottom: 0,
    logoMarginTop: 12,
    logoMarginRight: 36,
    controlMenuMarginLeft: 18,
    controlMenuMarginBottom: 660,
    opButtonMarginLeft: 20,
    opButtonGap: 20,
    opButtonMarginBottom: 10,
    betButtonGap: 0,
    betSpinnerGap: 4,
    betAmountGap: 10,
    turnDestX: 120,
    turnDestY: 720,

    // pre-loaded frames
    pokerFrames: null,
    pokerBackFrame: null,
    pokerEmptyFrame: null,

    // constructor
    ctor: function () {
        this._super();
    },

    // game initializer
    init: function () {
        this._super();

        // initialize sprite layout on BoardLayer
        this.validWidth = gameWidth;
        this.validHeight = gameHeight;
        this.size = cc.size(this.validWidth, this.validHeight);

        // initialize background
        this.bgSprite = cc.Sprite.create(s_bg);
        this.bgSprite.setAnchorPoint(0, 0);
        this.gameScale = this.bgScale = Math.max(this.validHeight / this.bgSprite.getContentSize().height,
                                    this.validWidth / this.bgSprite.getContentSize().width);
        this.bgSprite.setScale(this.bgScale);
        this.bgSprite.setPosition(0, 0);
        this.addChild(this.bgSprite, 0);

        if (MODE_LIVE === playMode) {
            // initialize bottom decoration
            this.decoBottom = cc.Sprite.create(s_dec_bottom);
            this.decoBottom.setAnchorPoint(0, 0);
            this.decoScale = this.validWidth / this.decoBottom.getContentSize().width;
            this.decoBottom.setScale(this.decoScale);
            this.decoBottom.setPosition(0, 0);
            this.addChild(this.decoBottom, 1);
        } else {
            // initialize operation buttons
            // call button
            this.callButton = ccui.Button.create(s_o_call_button, s_o_call_button_pressed, s_o_call_button);
            this.callButton.setAnchorPoint(0, 0);
            this.callButton.setScale(this.gameScale);
            this.callButton.setPosition(this.opButtonMarginLeft * this.gameScale, this.opButtonMarginBottom);
            this.addChild(this.callButton, 2);
            this.callButton.addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED === type) {
                    console.log('call pressed');
                    this.playerAction(call);
                }
            }, this);

            // raise button
            this.raiseButton = ccui.Button.create(s_o_raise_button, s_o_raise_button_pressed, s_o_raise_button);
            this.raiseButton.setAnchorPoint(0, 0);
            this.raiseButton.setScale(this.gameScale);
            this.raiseButton.setPosition(this.opButtonMarginLeft * this.gameScale +
                (this.callButton.getContentSize().width + this.opButtonGap) * this.gameScale,
                    this.opButtonMarginBottom);
            this.addChild(this.raiseButton, 2);
            this.raiseButton.addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED === type) {
                    console.log('raise pressed');
                    this.playerAction(raise);
                }
            }, this);

            // check button
            this.checkButton = ccui.Button.create(s_o_check_button, s_o_check_button_pressed, s_o_check_button);
            this.checkButton.setAnchorPoint(0, 0);
            this.checkButton.setScale(this.gameScale);
            this.checkButton.setPosition(this.opButtonMarginLeft * this.gameScale +
                (this.callButton.getContentSize().width + this.opButtonGap) * this.gameScale * 2,
                    this.opButtonMarginBottom);
            this.addChild(this.checkButton, 2);
            this.checkButton.addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED === type) {
                    console.log('check pressed');
                    this.playerAction(check);
                }
            }, this);

            // fold button
            this.foldButton = ccui.Button.create(s_o_fold_button, s_o_fold_button_pressed, s_o_fold_button);
            this.foldButton.setAnchorPoint(0, 0);
            this.foldButton.setScale(this.gameScale);
            this.foldButton.setPosition(this.opButtonMarginLeft * this.gameScale +
                (this.callButton.getContentSize().width + this.opButtonGap) * this.gameScale * 3,
                    this.opButtonMarginBottom);
            this.addChild(this.foldButton, 2);
            this.foldButton.addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED === type) {
                    console.log('fold pressed');
                    this.playerAction(fold);
                }
            }, this);

            // all in button
            this.allinButton = ccui.Button.create(s_o_allin_button, s_o_allin_button_pressed, s_o_allin_button);
            this.allinButton.setAnchorPoint(0, 0);
            this.allinButton.setScale(this.gameScale);
            this.allinButton.setPosition(this.opButtonMarginLeft * this.gameScale +
                (this.callButton.getContentSize().width + this.opButtonGap) * this.gameScale * 4,
                    this.opButtonMarginBottom);
            this.addChild(this.allinButton, 2);
            this.allinButton.addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED === type) {
                    console.log('all in pressed');
                    this.playerAction(allin);
                }
            }, this);

            // bet button
            this.betButton = ccui.Button.create(s_o_bet_button, s_o_bet_button_pressed, s_o_bet_button);
            this.betButton.setAnchorPoint(0, 0);
            this.betButton.setScale(this.gameScale);
            this.betButton.setPosition(this.opButtonMarginLeft * this.gameScale +
                (this.callButton.getContentSize().width + this.opButtonGap) * this.gameScale * 5,
                this.opButtonMarginBottom);
            this.addChild(this.betButton, 2);
            this.betButton.addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED === type) {
                    console.log('bet pressed');
                    this.playerAction(bet, 100);
                }
            }, this);

            // bet input
            this.bgBet = cc.Sprite.create(s_o_spinner);
            this.bgBet.setAnchorPoint(0, 0);
            this.bgBet.setScale(this.gameScale);
            this.bgBet.setPosition(this.betButton.getPositionX() +
                this.betButton.getContentSize().width * this.gameScale + this.betButtonGap,
                    this.opButtonMarginBottom);
            this.addChild(this.bgBet, 2);

            // bet spinner
            this.betSpinnerUp = ccui.Button.create(s_o_arrow_up, s_o_arrow_up, s_o_arrow_up);
            this.betSpinnerUp.setAnchorPoint(0, 0.5);
            this.betSpinnerUp.setScale(this.gameScale);
            this.betSpinnerUp.setPosition(this.bgBet.getPositionX() + this.betSpinnerGap * this.gameScale,
                this.bgBet.getPositionY() + this.bgBet.getContentSize().height * this.gameScale / 9 * 6);
            this.addChild(this.betSpinnerUp, 3);
            this.betSpinnerUp.addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED === type) {
                    console.log('up pressed');
                }
            }, this);

            this.betSpinnerDown = ccui.Button.create(s_o_arrow_down, s_o_arrow_down, s_o_arrow_down);
            this.betSpinnerDown.setAnchorPoint(0, 0.5);
            this.betSpinnerDown.setScale(this.gameScale);
            this.betSpinnerDown.setPosition(this.bgBet.getPositionX() + this.betSpinnerGap * this.gameScale,
                this.bgBet.getPositionY() + this.bgBet.getContentSize().height * this.gameScale / 9 * 3);
            this.addChild(this.betSpinnerDown, 3);
            this.betSpinnerDown.addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED === type) {
                    console.log('down pressed');
                }
            }, this);

            this.amountLabel = new cc.LabelTTF('20', this.amountTextFont, this.amountTextSize);
            this.amountLabel.setColor(cc.color(255, 255, 255, 255));
            this.amountLabel.setAnchorPoint(0.5, 0.5);
            this.amountLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.amountLabel.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.amountLabel.setScale(this.gameScale);
            this.amountLabel
                .setPosition(this.bgBet.getPositionX() + this.bgBet.getContentSize().width * this.gameScale / 2,
                    this.bgBet.getPositionY() + this.bgBet.getContentSize().height * this.gameScale / 2);
            this.addChild(this.amountLabel, 3);

            // initialize turn animation
            this.yourTurn = cc.Sprite.create(s_your_turn);
            this.yourTurn.setAnchorPoint(0.5, 0.5);
            this.yourTurn.setScale(this.gameScale * 4);
            this.yourTurn.setPosition(this.validWidth / 2, this.validHeight / 2);
            this.yourTurn.setVisible(false);
            this.addChild(this.yourTurn, 50);
        }

        // initialize dealer mm
        this.bgMM = cc.Sprite.create(s_bg_mm_2);
        this.bgMM.setAnchorPoint(0, 0);
        this.mmScale = this.gameScale * 0.75;
        this.bgMM.setScale(this.mmScale);
        this.bgMM.setPosition((this.validWidth - this.bgMM.getContentSize().width * this.mmScale) / 2,
            (this.bgSprite.getContentSize().height * this.gameScale -
                (this.mmMarginTop + this.bgMM.getContentSize().height) * this.mmScale));
        this.addChild(this.bgMM, 1);

        // initialize poker board
        this.bgBoard = cc.Sprite.create(s_bg_board);
        this.bgBoard.setAnchorPoint(0, 0);
        this.boardScale = this.gameScale;
        var boardRealMarginLeft = (this.bgSprite.getContentSize().width - this.bgBoard.getContentSize().width) / 2
                * this.gameScale;
        var boardRealMarginBottom = (this.bgSprite.getContentSize().height - this.bgBoard.getContentSize().height) / 2
                * this.gameScale;
        this.bgBoard.setScale(this.boardScale);
        this.bgBoard.setPosition(boardRealMarginLeft, boardRealMarginBottom);
        this.addChild(this.bgBoard, 2);

        // initialize players
        var playerIndex;
        this.playerScale = this.gameScale * 0.85;
        for (playerIndex = 0; playerIndex < this.maxPlayerCount; playerIndex++) {
            if (playerIndex < 5) {
                this.playerLayers[playerIndex] = new PlayerLayer(PLAYER_AT_RIGHT,
                    this.playerPosition[playerIndex].chipsYFix,
                    this.playerPosition[playerIndex].chipsXFix);
            } else {
                this.playerLayers[playerIndex] = new PlayerLayer(PLAYER_AT_LEFT,
                    this.playerPosition[playerIndex].chipsYFix,
                    this.playerPosition[playerIndex].chipsXFix);
            }
            this.playerLayers[playerIndex].init();
            this.playerLayers[playerIndex].setAnchorPoint(0, 0);
            this.playerLayers[playerIndex].setScale(this.playerScale);
            this.playerLayers[playerIndex].setPosition(this.playerPosition[playerIndex].x * this.gameScale,
                                                       this.playerPosition[playerIndex].y * this.gameScale);
            this.addChild(this.playerLayers[playerIndex], 5);
            this.playerLayers[playerIndex].setVisible(false);
        }

        // initialize public cards
        var publicCardIndex;
        this.publicCards = [];
        for (publicCardIndex = 0; publicCardIndex < this.maxPublicCardCount; publicCardIndex++) {
            this.publicCards[publicCardIndex] = cc.Sprite.create(s_p_back);
            this.publicCards[publicCardIndex].setAnchorPoint(0, 0);
            this.cardScale =
                0.85 * Math.max(this.cardVisualHeight / this.publicCards[publicCardIndex].getContentSize().height,
                    this.cardVisualWidth / this.publicCards[publicCardIndex].getContentSize().width) * this.gameScale;
            this.publicCards[publicCardIndex].setScale(this.cardScale);
            this.publicCards[publicCardIndex].setPosition(this.cardMarginLeft[publicCardIndex] * this.gameScale,
                    this.cardMarginBottom * this.gameScale);
            this.addChild(this.publicCards[publicCardIndex], 2);
            this.publicCards[publicCardIndex].setVisible(false);
        }

        // initialize alt frames
        this.initializeAltFrames();

        // initialize round text
        var shadowColor;
        this.roundLabel = new cc.LabelTTF('', this.roundTextFont, this.roundTextSize);
        this.roundLabel.setColor(cc.color(255, 255, 255, 255));
        this.roundLabel.setAnchorPoint(0, 0);
        this.roundLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.roundLabel.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.roundLabel.boundingWidth = this.roundTextWidth;
        this.roundLabel.boundingHeight = this.roundTextHeight;
        shadowColor = cc.color(128, 128, 128);
        this.roundLabel.enableShadow(shadowColor, cc.size(0, -4), 0);
        this.roundLabel.setScale(this.gameScale);
        this.roundLabel
            .setPosition((this.bgSprite.getContentSize().width - this.roundLabel.getContentSize().width) / 2
                    * this.gameScale,
                        this.roundTextMarginBottom * this.gameScale);
        this.addChild(this.roundLabel, 2);

        // initialize board text
        this.boardLabel = new cc.LabelTTF('', this.boardTextFont, this.boardTextSize);
        this.boardLabel.setColor(cc.color(255, 255, 255, 255));
        this.boardLabel.setAnchorPoint(0, 0);
        this.boardLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.boardLabel.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.boardLabel.boundingWidth = this.boardTextWidth;
        this.boardLabel.boundingHeight = this.boardTextHeight;
        this.boardLabel.setScale(this.gameScale);
        this.boardLabel
            .setPosition((this.bgSprite.getContentSize().width - this.boardLabel.getContentSize().width) / 2
                * this.gameScale,
                this.boardTextMarginBottom * this.gameScale);
        this.addChild(this.boardLabel, 2);

        // initialize bet text
        this.betLabel = new cc.LabelTTF('', this.betTextFont, this.betTextSize);
        this.betLabel.setColor(cc.color(255, 255, 255, 255));
        this.betLabel.setAnchorPoint(0, 0);
        this.betLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.betLabel.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.betLabel.boundingWidth = this.boardTextWidth;
        this.betLabel.boundingHeight = this.boardTextHeight;
        this.betLabel.setScale(this.gameScale);
        this.betLabel
            .setPosition((this.bgSprite.getContentSize().width - this.betLabel.getContentSize().width) / 2
                * this.gameScale,
                this.betTextMarginBottom * this.gameScale);
        this.addChild(this.betLabel, 2);

        // initialize author text
        if (playMode === MODE_LIVE) {
            this.authorLabel = new cc.LabelTTF('Engineering Camp 2017 Task Force & CDC Mobile Club',
                this.authorTextFont, this.authorTextSize);
            this.authorLabel.setColor(cc.color(255, 255, 255, 255));
            this.authorLabel.setAnchorPoint(0, 0);
            this.authorLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.authorLabel.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.authorLabel.boundingWidth = this.authorTextWidth;
            this.authorLabel.boundingHeight = this.authorTextHeight;
            this.authorLabel.setScale(this.gameScale);
            this.authorLabel
                .setPosition((this.bgSprite.getContentSize().width - this.authorLabel.getContentSize().width) / 2
                    * this.gameScale,
                    this.authorTextMarginBottom * this.gameScale);
            this.addChild(this.authorLabel, 2);
        }

        // initialize TrendMicro logo
        this.tmLogo = cc.Sprite.create(s_tm_logo);
        this.tmLogo.setAnchorPoint(0, 0);
        this.logoScale = this.gameScale * 0.8;
        this.tmLogo.setScale(this.logoScale);
        this.tmLogo.setPosition((this.bgSprite.getContentSize().width -
            this.tmLogo.getContentSize().width - this.logoMarginRight) * this.gameScale,
                (this.bgSprite.getContentSize().height -
                this.tmLogo.getContentSize().height - this.logoMarginTop) * this.gameScale);
        this.addChild(this.tmLogo, 2);

        // add start and stop button
        this.controlMenuScale = this.gameScale * 0.6;

        if (playMode === MODE_LIVE) {
            this.startButton = ccui.Button.create(s_start_button, s_start_button_pressed, s_start_button_disabled);
            this.startButton.setAnchorPoint(0, 0);
            this.startButton.setScale(this.controlMenuScale);
            this.startButton.setPosition(this.controlMenuMarginLeft * this.gameScale,
                this.controlMenuMarginBottom * this.gameScale);
            this.addChild(this.startButton, 2);
            this.startButton.addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED === type) {
                    console.log('start game');
                    if (gameStatus !== STATUS_GAME_RUNNING) {
                        startGame();
                    }
                }
            }, this);

            this.stopButton = ccui.Button.create(s_stop_button, s_stop_button_pressed, s_stop_button_disabled);
            this.stopButton.setAnchorPoint(0, 0);
            this.stopButton.setScale(this.controlMenuScale);
            this.stopButton.setPosition(this.controlMenuMarginLeft * this.gameScale,
                this.controlMenuMarginBottom * this.gameScale);
            this.addChild(this.stopButton, 2);
            this.stopButton.addTouchEventListener(function (sender, type) {
                if (ccui.Widget.TOUCH_ENDED === type) {
                    console.log('start game');
                    if (gameStatus === STATUS_GAME_RUNNING) {
                        stopGame();
                    }
                }
            }, this);
        }

        // add dealer layer on the top
        this.dealerLayer = new DealerLayer(this.gameScale);
        this.dealerLayer.init();
        this.dealerLayer.setAnchorPoint(0, 0);
        this.dealerLayer.setPosition(0, 0);
        this.dealerLayer.setVisible(false);
        this.addChild(this.dealerLayer, 100);

        // add winner layer on the top
        this.winnerLayer = new WinnerLayer(this.gameScale);
        this.winnerLayer.init();
        this.winnerLayer.setAnchorPoint(0, 0);
        this.winnerLayer.setPosition(0, 0);
        this.winnerLayer.setVisible(false);
        this.addChild(this.winnerLayer, 100);

        this.scheduleUpdate();
    },

    // game operations
    playerAction: function(callback, param) {
        callback(param);
    },

    update: function () {
        this.doUpdate();
    },

    doUpdate: function() {
        this.updateLayers();
    },

    updateLayers: function() {
        switch(gameStatus) {
            case STATUS_GAME_STANDBY:
            case STATUS_GAME_PREPARING:
                this.showLayer(this.dealerLayer, true);
                this.showLayer(this.winnerLayer, false);
                this.updateBoardLayer();
                this.updateDealerLayer();
                break;

            case STATUS_GAME_RUNNING:
                this.showLayer(this.dealerLayer, false);
                this.showLayer(this.winnerLayer, false);
                this.updateBoardLayer();
                break;

            case STATUS_GAME_FINISHED:
                this.showLayer(this.dealerLayer, false);
                this.showLayer(this.winnerLayer, true);
                this.winnerLayer.setWinners(winners);
                this.updateWinnerLayer();
                break;

            default:
                break;
        }
    },

    updateBoardLayer: function() {
        this.updateBoard();
        this.updatePlayers();
    },

    updateDealerLayer: function() {
        this.dealerLayer.update();
    },

    updateWinnerLayer: function() {
        this.winnerLayer.update();
    },

    // update sub layers
    updatePlayers: function() {
        if (!players || players.length === 0) {
            // no players at all
            return;
        }
        var playerIndex;
        for (playerIndex = 0; playerIndex < this.maxPlayerCount; playerIndex++) {
            if (players && players[playerIndex]) {
                this.updatePlayer(this.playerLayers[playerIndex], players[playerIndex], true);
            } else {
                this.updatePlayer(this.playerLayers[playerIndex], null, false);
            }
        }
    },

    updateBoard: function() {
        switch(gameStatus) {
            case STATUS_GAME_STANDBY:
                this.roundLabel.setString('BOARD ' + tableNumber + ' - GET READY');
                break;

            case STATUS_GAME_RUNNING:
                // update round info
                this.roundLabel.setString('BOARD ' + tableNumber + ' - ROUND ' + currentRound);
                this.boardLabel.setString(currentRoundName + ' - raise : ' + currentRaiseCount +
                    ' bet : ' + currentBetCount);

                // update bet info
                var betTotal = 0;
                for (var i = 0; i < players.length; i++) {
                    betTotal += players[i].accumulate;
                }
                this.betLabel.setString('TOTAL BET: $' + betTotal);

                // update public cards
                this.updatePublicCardsModel();
                var publicCardIndex;
                for (publicCardIndex = 0; publicCardIndex < this.maxPublicCardCount; publicCardIndex++) {
                    if (this.publicCardsModel[publicCardIndex] === null ||
                        '' === this.publicCardsModel[publicCardIndex]) {
                        this.changeSpriteImage(this.publicCards[publicCardIndex], this.pokerBackFrame);
                    } else {
                        this.changeSpriteImage(this.publicCards[publicCardIndex],
                            this.pokerFrames.get(this.publicCardsModel[publicCardIndex]));
                    }
                    this.publicCards[publicCardIndex].setVisible(true);
                }

                // update your turn
                if (playMode === MODE_PLAYER) {
                    this.yourTurnDest = new cc.p(this.turnDestX * this.gameScale,
                        this.turnDestY * this.gameScale);
                    if (turnAnimationShowed === false && yourTurn === true) {
                        // play animation
                        this.yourTurn.setVisible(true);
                        this.yourTurnAnimation(this.yourTurn,
                            this.gameScale * 4,
                            this.gameScale * 0.8,
                            this.yourTurnDest,
                            new cc.CallFunc(this.cbYourTurnAnimationFinished, this));
                        turnAnimationShowed = true;
                    }

                    if (yourTurn === false) {
                        this.yourTurn.setVisible(false);
                    }
                }
                break;

            case STATUS_GAME_FINISHED:
                this.roundLabel.setString('BOARD ' + tableNumber + ' - GAME OVER');
                break;

            default:
                break;
        }
    },

    updatePublicCardsModel: function() {
        this.publicCardsModel = publicCards;
    },

    // UI helpers
    showLayer: function(layer, show) {
        layer.setVisible(show);
        layer.eventListener.swallowTouches = show;
    },

    updatePlayer: function(playerLayer, player, show) {
        if (playerLayer) {
            playerLayer.setPlayer(player);
            playerLayer.setVisible(show);
            if (show) {
                playerLayer.update();
            }
        }
    },

    yourTurnAnimation: function (sprite, fromScale, toScale, toPos, callback) {
        sprite.setScale(fromScale);
        var spriteScaleTo = new cc.ScaleTo(0.5, toScale, toScale);
        var spriteMoveTo = new cc.MoveTo(0.5, toPos);
        var scaleSequence = new cc.Sequence(spriteScaleTo, spriteMoveTo, callback);
        sprite.runAction(scaleSequence);
    },

    cbYourTurnAnimationFinished: function(nodeExecutingAction, data) {
        console.log('sprite animation finished');
    },

    initializeAltFrames: function() {
        var index;
        this.pokerBackFrame = cc.SpriteFrame.create(s_p_back, cc.rect(0, 0,
            this.publicCards[0].getContentSize().width, this.publicCards[0].getContentSize().height));

        this.pokerEmptyFrame = cc.SpriteFrame.create(s_p_empty, cc.rect(0, 0,
            this.publicCards[0].getContentSize().width, this.publicCards[0].getContentSize().height));

        var pokerKeys = pokerMap.keys();
        this.pokerFrames = new Map();
        for (index = 0; index < pokerKeys.length; index++) {
            var pokerFrame = cc.SpriteFrame.create(pokerMap.get(pokerKeys[index]), cc.rect(0, 0,
                this.publicCards[0].getContentSize().width, this.publicCards[0].getContentSize().height));
            this.pokerFrames.set(pokerKeys[index], pokerFrame);
        }
    },

    changeSpriteImage: function(sprite, srcFrame) {
        if (sprite && srcFrame) {
            sprite.setSpriteFrame(srcFrame);
        }
    }
});
