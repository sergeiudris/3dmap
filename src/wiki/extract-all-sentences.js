
module.exports = extractAllSentences;

function extractAllSentences(sectionsArr) {

    var allSentences = [];
    var regexSentence = /.*?((?:[!?]+|\.+(?!([0-9]|\.+))))|[\w\s\d\.\-\[\]\(\)\:\;\,]+$/gi;

    for (var i = 0; i < sectionsArr.length; i++) {
        var section = sectionsArr[i];
        var subsections = section.subsections;
        var content = subsections.length === 0 ? section.content : "";
        for (var j = 0; j < subsections.length; j++) {
            content += subsections[j].content;
        }
        var sentences = content.match(regexSentence);
        sentences = sentences.filter(function (val, index, arr) {
            var x = val.match(/\d+/);
            return x ? true : false;
        });
        allSentences = allSentences.concat(sentences);
    }
    return allSentences;

}