// table.svg 0.1.0
// 
// Copyright (c) 2014 cocu
//
// Licensed under the Apache License, Version 2.0 (the "License")
//
// github: https://github.com/cocu/table.svg
// build : 2014-11-03
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
TableSVG.addMode('VerticalTable', null, function (Parent, global, _) {
  function VerticalTable(args) {
    Parent.call(this);
    var requiredArgs = [
      'rowHeights', // 2-Dim array (colWidths.length x eachCellHeightInTheCol)
      'colWidths',
      'rootHeight',
      'rootWidth'
    ];
    var lackArgs = requiredArgs.filter(function (elem) {
      return args === undefined || args[elem] === undefined
    }).join(', ');
    if (lackArgs.length > 0) {
      throw 'NoRequiredArgument: ' + lackArgs;
    }

    var rowHeights = args['rowHeights'];
    var colWidths = args['colWidths'];
    var colNum = colWidths.length;
    if (colNum !== rowHeights.length) {
      throw 'no match the number of col and row, col:' + colNum + ' row:' + row.length;
    }

    this._colNum = colNum;
    this._rowHeights = rowHeights;
    this._colWidths = colWidths;
    this._viewWidth = _.sum(colWidths);
    this._viewHeight = Math.max.apply(null, rowHeights.map(_.sum));

    this.rootElem.node.setAttribute('viewBox', '0 0 ' + this._viewWidth + ' ' + this._viewHeight);

    this._initTable();
  }

  _.inherit(VerticalTable, Parent);

  (function (proto) {
    // private methods
    proto._initTable = function () {
      var that = this;
      var table = this.rootElem;
      var x = 0;
      this._colWidths.map(function (width, colNo) {
        var y = 0;
        var cols = that._rowHeights[colNo].map(function (height, row) {
          var cell = that.createCell(row, colNo, width, height);
          cell.transform('translate(0,' + y + ')');
          y += height;
          return cell;
        });
        var col = table.g();
        cols.map(function (c) {
          col.add(c)
        });
        col.transform('translate(' + x + ',0)');
        x += width;
        return col;
      })
    };
    // public methods
    proto.isInSelecting = function (cell) {
      // todo fix it
      var col = cell.data('col'),
        row = cell.data('row');
      var start = this.status.start.col + this.status.start.row * this._colNum;
      var end = this.status.end.col + this.status.end.row * this._colNum;
      var curr = col + row * this._colNum;
      var min = Math.min(start, end);
      var max = Math.max(start, end);
      return min <= curr && curr <= max;
    };
  })(VerticalTable.prototype);

  return VerticalTable;
});