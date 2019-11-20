var getJSONP = require("./get-JSONP");

module.exports = fetchPage;

function fetchPage(title, callback) {
    var url = "https://en.wikipedia.org/w/api.php?format=json" +
        "&action=query" +
        "&prop=images|extracts" +
        //  "&exintro" +
        "&redirects&explaintext&titles=" +
        encodeURIComponent(title);
    getJSONP(url, function (res) {
        var pageText = "";
        var pages = res.query.pages
        for (var p in pages) {
            pageText = pages[p].extract;
        }
        callback(pageText);
    });
};