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
  TableSVG.createElement = function (elemName) {
    return global.doc.createElementNS(xmlns.svg, elemName);
  };

  TableSVG.modes = {};
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
    // Table constructor
    var rootElem = TableSVG.createElement('svg');
    this.rootElem = rootElem;

    this.classes = {
      active: 'active',
      root: 'svg-table'
    };

    this._status = {
      start: {col: null, row: null},
      end: {col: null, row: null},
      isSelecting: false
    };

    Snap(rootElem).addClass(this.classes.root);

    global.doc.body.addEventListener('mouseup', this._activateSelectingCells);
  }

  (function (tlproto) {
    // private methods
    tlproto._clearSelectingCells = function () {
      var col, row;
      for (row = this.cells.length; row--;) {
        for (col = this.cells[row].length; col--;) {
          this.cells[row][col].removeClass(this.classes.selecting);
        }
      }
    };
    tlproto._activateSelectingCells = function () {
      this._clearSelectingCells();
      this._toggleSelectingCellClass(this.classes.active, true);
    };
    tlproto._toggleSelectingCellClass = function (className, flag) {
      if (flag === undefined) {
        flag = this.cells[this._status.start.row][this._status.start.col].hasClass(className);
      }
      var row, col;
      for (row = this.cells.length; row--;) {
        for (col = this.cells[row].length; col--;) {
          var cell = this.cells[row][col];
          if (this.isInSelecting(cell, row, col)) {
            cell.toggleClass(className, flag);
          }
        }
      }
    };
    tlproto._eventHandlerFactory = function (colNo, rowNo) {
      var that = this;
      var status = this._status;
      var saveStatusStart = function () {
        status.start.col = colNo;
        status.start.row = rowNo;
      };
      var saveStatusEnd = function () {
        status.end.col = colNo;
        status.end.row = rowNo;
      };
      return {
        mousedown: function (event) {
          saveStatusStart();
          status.isSelecting = true;
          event.preventDefault();
        },
        mouseover: function (event) {
          that._clearSelectingCells();
          if (status.isSelecting && event.buttons != 0 && event.which % 2 != 0) {
            saveStatusEnd();
            that._toggleSelectingCellClass(that.classes.selecting, true);
          }
          event.preventDefault();
        },
        mouseup: function (event) {
          status.isSelecting = false;
          saveStatusEnd();
          that._activateSelectingCells();
          event.preventDefault();
        }
      }
    };
    // public methods
    tlproto.getRootElem = function () {
      return this.rootElem;
    };
    tlproto.isInSelecting = function (cell, row, col) {
      throw 'NotImplementedException';
    };
    tlproto.createCell = function (row, col, width, height) {
      var cell = Snap(TableSVG.createElement('rect'));
      cell.attr({
        width: width,
        height: height
      });
      this.cells[row][col] = cell;
      return cell;
    };
  }(Table.prototype));


  TableSVG.addMode = function (modeName, func, parentModeName) {
    if (parentModeName === undefined) {
      parent = Table;
    } else {
      parent = this.modes[parentModeName];
    }
    var newMode = func(parent, global);
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