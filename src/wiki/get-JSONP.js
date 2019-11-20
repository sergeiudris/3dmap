
module.exports = getJSONP;

function getJSONP (url, callback) {

    var body = document.body;
    var script = document.createElement('script');
    var uid = generateUIDNotMoreThan1million();
    script.id = uid;
    window[uid] = function (res) {
        callback(res);
        delete window[uid];
        var element = document.getElementById(uid);
        element.parentNode.removeChild(element);
    };
    url = url.concat("&callback=").concat(uid);
    body.appendChild(script);
    script.src = url;
};

function generateUIDNotMoreThan1million  () {
    return "callback_" + ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4)
}