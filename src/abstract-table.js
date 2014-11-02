var TableSVG = (function () {
  var xmlns = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/2000/xhtml',
    xlink: 'http://www.w3.org/1999/xlink'
  };
  var utils = {};

  function TableSVG() {
  }

  TableSVG.Mode = {};

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
    this.debug = function (s) {
      log('[DEBUG]', s);
    };
  })();

  function AbstractTable() {
    // AbstractTable constructor
    var rootElem = Snap(TableSVG.createElement('svg'));
    this.rootElem = rootElem;

    this.classes = {
      active: 'active',
      root: 'svg-table',
      selecting: 'selecting',
      cell: 'cell'
    };

    this.status = {
      start: {col: null, row: null},
      end: {col: null, row: null},
      isSelecting: false
    };

    this.cells = [];
    this.table = {};

    Snap(rootElem).addClass(this.classes.root);

    var that = this;
    global.doc.body.addEventListener('mouseup', function () {
      if (that.status.isSelecting) {
        that._activateSelectingCells.call(that)
      }
      that.status.isSelecting = false;
    });
  }

  (function (tlproto) {
    // private methods
    tlproto._clearSelectingCells = function () {
      var that = this;
      this.cells.forEach(function (cell) {
        cell.removeClass(that.classes.selecting);
      });
    };
    tlproto._activateSelectingCells = function () {
      this._clearSelectingCells();
      this._toggleSelectingCellClass(this.classes.active);
    };
    tlproto._toggleSelectingCellClass = function (className, flag) {
      if (flag === undefined) {
        flag = !this.table[this.status.start.row][this.status.start.col].hasClass(className);
      }
      var that = this;
      this.cells.forEach(function (cell) {
        if (that.isInSelecting(cell)) {
          cell.toggleClass(className, flag)
        }
      });
    };
    tlproto._eventHandlerFactory = function (colNo, rowNo) {
      var that = this;
      var status = this.status;
      var saveStatusStart = function () {
        status.start.col = colNo;
        status.start.row = rowNo;
      };
      var saveStatusEnd = function () {
        status.end.col = colNo;
        status.end.row = rowNo;
      };
      var redrawSelecting = function () {
        that._toggleSelectingCellClass(that.classes.selecting, true);
      };
      return {
        mousedown: function (event) {
          saveStatusStart();
          saveStatusEnd();
          status.isSelecting = true;
          redrawSelecting();
          event.preventDefault();
        },
        mouseover: function (event) {
          that._clearSelectingCells();
          if (status.isSelecting && event.buttons != 0 && event.which % 2 != 0) {
            saveStatusEnd();
            redrawSelecting();
          }
          event.preventDefault();
        }
      }
    };
    // public methods
    tlproto.getRootElem = function () {
      return this.rootElem.node;
    };
    tlproto.createCell = function (row, col, width, height) {
      var cell = this.genCellElem(row, col, width, height);
      this.registerCellToTable(cell, row, col);
      this.setCellHandlers(cell, row, col);
      return cell;
    };
    tlproto.genCellElem = function (row, col, width, height) {
      var cell = Snap(TableSVG.createElement('rect'));
      cell.attr({
        width: width,
        height: height
      });
      return cell;
    };
    tlproto.registerCellToTable = function (cell, row, col) {
      cell.addClass(this.classes.cell);
      cell.data('row', row);
      cell.data('col', col);
      this.cells.push(cell);
      if (this.table[row] === undefined) {
        this.table[row] = {};
      }
      this.table[row][col] = cell;
    };
    tlproto.setCellHandlers = function (cell, row, col) {
      var handler = this._eventHandlerFactory(col, row);
      cell.node.addEventListener('mousedown', handler.mousedown);
      cell.node.addEventListener('mouseover', handler.mouseover);
      return cell;
    };
    tlproto.generateTable = function () {
      throw 'NotImplementedError: generateTable';
    };
    tlproto.isInSelecting = function (cell) {
      throw 'NotImplementedError: isInSelecting';
    };
  }(AbstractTable.prototype));


  TableSVG.addMode = function (modeName, parentModeName, func) {
    if (parentModeName) {
      parent = TableSVG.Mode[parentModeName];
      if (parent === undefined) {
        logger.fatal('no such mode error mode:' + parentModeName);
      }
    } else {
      parent = AbstractTable;
    }
    var newMode = func(parent, global, utils);
    if (!newMode instanceof AbstractTable) {
      logger.warn('no inherit AbstractTable. please set prototype AbstractTable(first argument) modeName:' + modeName);
    }
    TableSVG.Mode[modeName] = newMode;
  };

  TableSVG.plugin = function (func) {
    func(TableSVG, AbstractTable, global, utils);
  };

  // utils
  utils.sum = function (arr) {
    return arr.reduce(function (prev, current, i, arr) {
      return prev + current;
    });
  };
  utils.inherit = function (childCon, parentCon) {
    childCon._parent = parentCon;
    childCon.prototype = Object.create(parentCon.prototype, {
      constructor: {
        value: childCon,
        enumerable: false,
        writable: true,
        configurable: true
      }
    })
  };
  utils.logger = logger;

  return TableSVG;
})();