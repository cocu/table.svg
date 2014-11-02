var TableSVG = (function () {
  var xmlns = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/2000/xhtml',
    xlink: 'http://www.w3.org/1999/xlink'
  };

  function TableSVG(w, h, options) {
  }

  TableSVG.createElement = function (elemName) {
    return glob.doc.createElementNS(xmlns.svg, elemName)
  };

  TableSVG._ = {};
  var global = {
    xmlns: xmlns,
    win: window,
    doc: window.document
  };
  TableSVG._.global = global;

  var modes = {};
  var logger = (function () {
    var log = function (level, s) {
      console.log('[table.svg]' + level + ' ' + s);
    };
    this.fatal = function (s) {
      log('[FATAL]', s);
    };
    this.warn = function (s) {
      log('[WARN]', s);
    };
    this.info = function (s) {
      log('[INFO]', s);
    };
  })();

  function Table() {
    var rootElem = document.createElementNS(xmlns.svg, 'svg');
    this.rootElem = rootElem;

    this.classes = {
      active: 'active',
      root: 'svg-table'
    };
    
  }

  (function (tlproto) {
    tlproto.getRootElem = function () {
      return this.rootElem;
    };
  }(Table.prototype));

  Table._ = {};
  Table._.privates = (function () {
    var privates = {};

    privates.actions = {};
    privates.actions.start_selecting = function () {
    };

    return privates;
  })();

  TableSVG.addMode = function (modeName, func) {
    var newMode = func(Table, global);
    if (!newMode instanceof Table) {
      logger.warn('no inherit Table. please set prototype Table(first argument) modeName:' + modeName);
    }
    modes[modeName] = newMode;
  };

  TableSVG.plugin = function (func) {
    func(TableSVG, Table, global);
  };

  return TableSVG;
})();