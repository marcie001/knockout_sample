$(function () {
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }
    function randomInt(min, max) {
        return Math.floor(random(min, max));
    }

    function Character(data) {
        var self = this;
        self.name = data ? data.name : '';
        self.hp = ko.observable(data ? data.hp : 0);
        self.hpMax = data ? data.hp : 0;
        self.attack = data ? data.attack : 0;
        self.defence = data ? data.defence : 0;
        self.image = data ? data.image : 'img/no_selected.jpg';
        var array;
        if (data) {
            data.specialMoves.unshift({ name: "防御", attack: 0, defence: true });
            array = data.specialMoves;
        } else {
            array = [];
        }
        self.specialMoves = array;
        self.attacked = function (enemyMove, myMove) {
            var enemyAttack = Math.floor(enemyMove.attack * random(0, 2));
            var myDefence = Math.floor(myMove.defence ? self.defence  * random(0, 2) : 0);
            console.log(self.name + ' ' + enemyAttack + ' points attacked and ' + myDefence + ' points defence');
            var newhp = self.hp() - enemyAttack + myDefence;
            self.hp(newhp > 0 ? newhp : 0);
        };
    }
    
    function BattleViewModel() {
        var self = this;
        var noCharacter = new Character();
        self.characters = ko.observableArray([]);
        self.player = ko.observable(noCharacter);
        self.cpu = ko.observable(noCharacter);
        var situations = {
            select: 1,
            game: 2,
            result: 3
        };
        self.situation = ko.computed(function () {
            if (!self.cpu().name) {
                return situations.select;
            }
            if ((self.cpu().name
                        && self.cpu().hp() > 0
                        && self.player().hp() > 0)
                    || self.isInAttackAnimation()) {
                return situations.game;
            }
            return situations.result;
        });
        self.isSelect = ko.computed(function () {
            return self.situation() == situations.select;
        });
        self.isGame = ko.computed(function () {
            return self.situation() == situations.game;
        });
        self.isResult = ko.computed(function () {
            return self.situation() == situations.result;
        });
        self.isInAttackAnimation = ko.observable(false);

        // get character data
        $.getJSON('/knockout/character.json', function (allData) {
            var data = $.map(allData, function (item) {
                return new Character(item);
            });
            self.characters(data);
        });

        // events
        self.displayCharacter = function (character) {
            !self.isSelect() || self.player(character);
        };
        self.hideCharacter = function (character) {
            !self.isSelect() || self.player(noCharacter);
        };
        self.chooseCharacter = function (character) {
            if (!self.isSelect()) {
                return;
            }
            self.characters.remove(character);
            self.player(character);
            var randomCharacter = self.characters()[randomInt(0, self.characters().length)];
            self.characters.remove(randomCharacter);
            self.cpu(randomCharacter);
        };
        self.attackEachOther = function (playerMove) {
            self.isInAttackAnimation(true);
            $('#battle_field > div')
            .text('TODO: battle animation')
            .slideDown(2500, function () {
                $(this).hide();
                self.isInAttackAnimation(false);
            });
            var cpuMove = self.cpu().specialMoves[randomInt(0, self.cpu().specialMoves.length)];
            self.cpu().attacked(playerMove, cpuMove);
            self.player().attacked(cpuMove, playerMove);
        };
    }
    
    ko.applyBindings(new BattleViewModel());
});
