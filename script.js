'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        prompt: (bot) => bot.say('HELLO'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say('Vous voulez en savoir plus sur moi ? Commencez par demander l\'heure.')
                .then(() => 'speak');
        }
    },

    speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

                if (!_.has(scriptRules, upperText)) {
                    return bot.say(`Désolé, je ne comprends pas.`).then(() => 'speak');
                }
                
                
                /*if(upperText == 'HELLO' || upperText == 'HI' || upperText == 'HEY' || upperText == 'YO')
                {
                    return bot.say("Coucou");
                    var p = Promise.resolve();
                    p = p.then(function() {
                            console.log("Coucou");
                            return bot.say("Coucou");
                        });
                }
                else*/
                {
                    var response = scriptRules[upperText];
                    var lines = response.split('\n');
    
                    var p = Promise.resolve();
                    _.each(lines, function(line) {
                        line = line.trim();
                        p = p.then(function() {
                            console.log(line);
                            return bot.say(line);
                        });
                    })
                }
                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
