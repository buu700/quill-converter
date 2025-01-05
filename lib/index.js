const getQuill = typeof document === 'object' ?
  () => {
    const div = document.createElement('div');
    div.style.display = 'none';
    document.body.appendChild(div);
    return new (require('quill'))(div);
  } :
  () => {
    const fs = eval('require')('fs');
    const path = eval('require')('path');

    const jsdom = eval('require')('jsdom');
    const { JSDOM } = jsdom;

    const quillFilePath = eval('require').resolve('quill');
    const quillDistFilePath = quillFilePath.replace(
      'quill.js',
      path.join('dist', 'quill.js')
    );

    const quillLibrary = fs.readFileSync(quillDistFilePath).toString();

    const JSDOM_TEMPLATE = `
      <div id="editor">hello</div>
      <script>${quillLibrary}</script>
    `;

    const JSDOM_OPTIONS = { runScripts: 'dangerously', resources: 'usable' };
    const DOM = new JSDOM(JSDOM_TEMPLATE, JSDOM_OPTIONS);
    return new DOM.window.Quill('#editor');
  };

const cache = {};

exports.convertTextToDelta = (text) => {
  if (!cache.quill) {
    cache.quill = getQuill();
  }

  const delta = cache.quill.clipboard.convert({text});
  return delta;
};

exports.convertHtmlToDelta = (html) => {
  if (!cache.quill) {
    cache.quill = getQuill();
  }

  const delta = cache.quill.clipboard.convert({html});
  return delta;
};

exports.convertDeltaToHtml = (delta) => {
  if (!cache.quill) {
    cache.quill = getQuill();
  }

  cache.quill.setContents(delta);

  const html = cache.quill.getSemanticHTML();
  return html;
};
