var fetchPage = require("./fetch-page.js");
var parsePage = require("./parse-page.js");
var extractAllSentences = require("./extract-all-sentences.js");
var getRandomSentences = require("./get-random-sentences.js");

module.exports = getPage;

function getPage(title, callback, count) {

    fetchPage(title, function (pageText) {
        var parsedPage = parsePage(pageText);
        var allSentences = extractAllSentences(parsedPage.sectionsArr);
        var sentences = getRandomSentences(allSentences, count || 10);

        callback({
            firstPassage: parsedPage.firstPassage,
            sentences: sentences
        })

    }.bind(this))

}