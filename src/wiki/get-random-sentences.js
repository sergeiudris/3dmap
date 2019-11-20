
module.exports = getRandomSentences;

function getRandomSentences(sentences, count) {
    shuffle(sentences);
    // var output = "";
    var result = [];
    for (var i = 0; i < Math.min(sentences.length, count); i++) {
        var modifiedSentence = sentences[i].replace(/\d+/, "__________");
        var answer = sentences[i].match(/\d+/);
        result.push({
            data: [modifiedSentence, sentences[i]],
            answer: parseFloat(answer)
        });
        //result.push([modifiedSentence, sentences[i]]);
    }
    return result;
    // window.UI.renderList("sentences", { data: items });
}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
