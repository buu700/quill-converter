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

    const quillLibrary = fs.readFileSync(quillDistFilePath);

    const JSDOM_TEMPLATE = `
      <div id="editor">hello</div>
      <script>${quillLibrary}</script>
      <script>
        document.getSelection = function() {
          return {
            getRangeAt: function() { }
          };
        };
        document.execCommand = function (command, showUI, value) {
          try {
              return document.execCommand(command, showUI, value);
          } catch(e) {}
          return false;
        };
      </script>
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

  cache.quill.setText(text);

  let delta = cache.quill.getContents();
  return delta;
};

exports.convertHtmlToDelta = (html) => {
  if (!cache.quill) {
    cache.quill = getQuill();
  }

  let delta = cache.quill.clipboard.convert(html);

  return delta;
};

exports.convertDeltaToHtml = (delta) => {
  if (!cache.quill) {
    cache.quill = getQuill();
  }

  cache.quill.setContents(delta);

  let html = cache.quill.root.innerHTML;
  return html;
};
