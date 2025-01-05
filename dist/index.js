"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDeltaToHtml = exports.convertHtmlToDelta = exports.convertTextToDelta = void 0;
var getQuill = typeof document === 'object' ?
    function () {
        var div = document.createElement('div');
        div.style.display = 'none';
        document.body.appendChild(div);
        return new (require('quill'))(div);
    } :
    function () {
        var fs = eval('require')('fs');
        var path = eval('require')('path');
        var jsdom = eval('require')('jsdom');
        var JSDOM = jsdom.JSDOM;
        var quillFilePath = eval('require').resolve('quill');
        var quillDistFilePath = quillFilePath.replace('quill.js', path.join('dist', 'quill.js'));
        var quillLibrary = fs.readFileSync(quillDistFilePath).toString();
        var JSDOM_TEMPLATE = "\n\t\t\t<div id=\"editor\">hello</div>\n\t\t\t<script>".concat(quillLibrary, "</script>\n\t\t");
        var JSDOM_OPTIONS = { runScripts: 'dangerously', resources: 'usable' };
        var DOM = new JSDOM(JSDOM_TEMPLATE, JSDOM_OPTIONS);
        return new DOM.window.Quill('#editor');
    };
var quill;
var convertTextToDelta = function (text) {
    if (!quill) {
        quill = getQuill();
    }
    var delta = quill.clipboard.convert({ text: text });
    return delta;
};
exports.convertTextToDelta = convertTextToDelta;
var convertHtmlToDelta = function (html) {
    if (!quill) {
        quill = getQuill();
    }
    var delta = quill.clipboard.convert({ html: html });
    return delta;
};
exports.convertHtmlToDelta = convertHtmlToDelta;
var convertDeltaToHtml = function (delta) {
    if (!quill) {
        quill = getQuill();
    }
    quill.setContents(delta);
    var html = quill.getSemanticHTML();
    return html;
};
exports.convertDeltaToHtml = convertDeltaToHtml;
//# sourceMappingURL=index.js.map