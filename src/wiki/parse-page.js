
module.exports = parsePage;


function parsePage(pageText) {
    var index = pageText.indexOf('\n');
    var splits = [pageText.slice(0, index), pageText.slice(index + 1)];
    var first = splits[0];
    var other = splits[1];
    other = other.replace(/(?:\r\n|\r|\n)/g, '');
    //var regexSections = /(\={1,5}\s[^=]+\s\={1,5})([^=]+)/gi;
    var regexDoubleEquals = /(\={2}\s.+?\s\={2})(.+?(?=[^=]\=\=\s))/gi;
    var regexTripleEquals = /(\={3}\s.+?\s\={3})(.+?(?=[^=]\=\=\=\s))/gi;
    var result = [];
    var subsections = [];
    var sectionMatches = getMatches(other, regexDoubleEquals);
    var exclusionsSections = ["see also", "further reading", "references"];
    var exclusionsSubsections = ["religion"];
    for (var i = 0; i < sectionMatches.length; i++) {
        var section = sectionMatches[i];
        var title = section[1];
        if (exclusionsSections.indexOf(title.replace(/(?:\s?\=\=\s?)/g, '').toLowerCase()) !== -1) {
            continue;
        }
        var content = section[2];

        var subsectionMathces = getMatches(content, regexTripleEquals);
        result.push({
            title: title,
            content: content.replace(/(?:\={1,5}.+?\={1,5})/gi, ''),
            subsections: subsectionMathces
                .filter(function (el) {
                    if (exclusionsSubsections.indexOf(el[1].replace(/(?:\s?\=\=\=\s?)/g, '').toLowerCase()) !== -1) {
                        return false;
                    }
                    return true;
                })
                .map(function (el, i, arr) {

                    return {
                        title: el[1],
                        content: el[2]
                    }
                })
        });

    }

    return {
        firstPassage: first,
        sectionsArr: result
    };

};

function getMatches(string, regex) {
    // index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
        matches.push(match);
    }
    return matches;
}