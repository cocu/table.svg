// table.svg 0.1.0
// 
// Copyright (c) 2014 cocu
//
// Licensed under the Apache License, Version 2.0 (the "License")
//
// github: https://github.com/cocu/table.svg
// build : 2015-01-21
var TableSVG = (function () {
  var xmlns = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/2000/xhtml',
    xlink: 'http://www.w3.org/1999/xlink'
  };
  var utils = {};
  var selectMode = {};

  function TableSVG() {
  }

  TableSVG.Mode = {};

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

  function AbstractTable(args) {
    // AbstractTable constructor
    var requiredArgs = [
      'rootWidth', // 2-Dim array (colWidths.length x eachCellHeightInTheCol)
      'rootHeight',
      'viewBox'
    ];
    var lackArgs = requiredArgs.filter(function (elem) {
      return args === undefined || args[elem] === undefined
    }).join(', ');
    if (lackArgs.length > 0) {
      throw 'NoRequiredArgument: ' + lackArgs;
    }

    this.classes = {
      active: 'active',
      root: 'svg-table',
      selecting: 'selecting',
      cell: 'cell',
      rowHeader: 'row-header',
      colHeader: 'col-header',
      header: 'header'
    };

    this.rootElem = this._initRootElem(args.rootWidth, args.rootHeight, args.viewBox);

    this.status = {
      start: {col: null, row: null},
      end: {col: null, row: null},
      isSelecting: false
    };

    this.cells = [];
    this.table = {};
    this.header = {
      row: {},
      col: {}
    };

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
    tlproto._initRootElem = function (width, height, viewBox) {
      var rootElem = Snap(utils.createElement('svg'));
      rootElem.node.setAttribute('viewBox', viewBox);
      rootElem.node.setAttribute('height', height);
      rootElem.node.setAttribute('width', width);
      rootElem.addClass(this.classes.root);
      return rootElem;
    };
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
      this.selectMode.updateStatus(this.status);
      var that = this;
      this.cells.forEach(function (cell) {
        if (that.selectMode.isInSelecting(cell, that.status)) {
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
    tlproto._registerCell = function (cell, row, col) {
      cell.addClass(this.classes.cell);
      cell.data('row', row);
      cell.data('col', col);
      this.cells.push(cell);
      if (this.table[row] === undefined) {
        this.table[row] = {};
      }
      this.table[row][col] = cell;
    };
    tlproto._setCellHandlers = function (cell, row, col) {
      var handler = this._eventHandlerFactory(col, row);
      cell.node.addEventListener('mousedown', handler.mousedown);
      cell.node.addEventListener('mouseover', handler.mouseover);
      return cell;
    };
    tlproto._registerRowHeader = function (header, row) {
      header.addClass(this.classes.rowHeader);
      header.addClass(this.classes.header);
      header.data('row', row);
      this.header.row[row] = header;
    };
    tlproto._registerColHeader = function (header, col) {
      header.addClass(this.classes.colHeader);
      header.addClass(this.classes.header);
      header.data('col', col);
      this.header.col[col] = header;
    };
    // public methods
    tlproto.getRootElem = function () {
      return this.rootElem.node;
    };
    tlproto.createCell = function (row, col, width, height) {
      var cell = this.genCellElem(row, col, width, height);
      this._registerCell(cell, row, col);
      this._setCellHandlers(cell, row, col);
      return cell;
    };
    tlproto.createRowHeader = function (row, height) {
      var header = this.genRowHeaderElem(row, height);
      this._registerRowHeader(header, row);
      return header;
    };
    tlproto.createColHeader = function (col, width) {
      var header = this.genColHeaderElem(col, width);
      this._registerColHeader(header, col);
      return header;
    };
    tlproto.getRootElem = function () {
      return this.rootElem.node;
    };
    tlproto.getActiveCells = function () {
      var activeClass = this.classes.active;
      return this.cells.filter(function (cell) {
        return cell.hasClass(activeClass);
      });
    };
    tlproto.genRowHeaderElem = function (row, height) {
    };
    tlproto.genColHeaderElem = function (col, width) {
    };
    tlproto.genCellElem = function (row, col, width, height) {
      var cell = Snap(utils.createElement('g'));
      cell.rect(0, 0, width, height);
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

  // selectMethods
  selectMode = {};
  selectMode.horizontal = function (colNum) {
    return {
      updateStatus: function (status) {
        var start = status.start.col + status.start.row * colNum;
        var end = status.end.col + status.end.row * colNum;
        status.min = Math.min(start, end);
        status.max = Math.max(start, end);
      },
      isInSelecting: function (cell, status) {
        var col = cell.data('col');
        var row = cell.data('row');
        var curr = col + row * colNum;
        return status.min <= curr && curr <= status.max;
      }
    }
  };
  selectMode.vertical = function (rowNum) {
    return {
      updateStatus: function (status) {
        var start = status.start.col * rowNum + status.start.row;
        var end = status.end.col * rowNum + status.end.row;
        status.min = Math.min(start, end);
        status.max = Math.max(start, end);
      },
      isInSelecting: function (cell, status) {
        var col = cell.data('col');
        var row = cell.data('row');
        var curr = col * rowNum + row;
        return status.min <= curr && curr <= status.max;
      }
    }
  };

  // utils
  utils = {};
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
  utils.translate = function (elem, x, y) {
    elem.transform('translate(' + x + ',' + y + ')')
  };
  utils.createElement = function (elemName) {
    return global.doc.createElementNS(xmlns.svg, elemName)
  };
  utils.checkArgs = function (requiredArgs, args) {
    if (args === undefined) {
      throw 'UndefinedArgument: ' + args;
    }
    var lackArgs = requiredArgs.filter(function (elem) {
      return args === undefined || args[elem] === undefined
    }).join(', ');
    if (lackArgs.length > 0) {
      throw 'NoRequiredArgument: ' + lackArgs;
    }
  };
  /**
   * @param {object} target
   * @param {object} source
   */
  utils.hashMerge = function (target, source) {
    for (var key in source) {
      target[key] = source[key];
    }
  };
  utils.logger = logger;
  utils.selectMode = selectMode;

  return TableSVG;
})();
TableSVG.addMode('VerticalTable', null, function (Parent, global, utils) {
  function VerticalTable(args) {
    var requiredArgs = [
      'rowHeights', // 2-Dim array (colWidths.length x eachCellHeightInTheCol)
      'colWidths',
      'rootHeight',
      'rootWidth'
    ];
    var optionalArgs = [
      'colHeaders',
      'colHeaderHeight'
    ];

    utils.checkArgs(requiredArgs, args);

    var rowHeights = args['rowHeights'];
    var colWidths = args['colWidths'];
    var rootHeight = args['rootHeight'];
    var rootWidth = args['rootWidth'];

    var viewWidth = utils.sum(colWidths);
    var viewHeight = Math.max.apply(null, rowHeights.map(utils.sum));

    var colHeaders = args['colHeaders'];
    var colHeaderHeight = args['colHeaderHeight'] ? args['colHeaderHeight'] : 0;

    Parent.call(this, {
      rootHeight: rootHeight,
      rootWidth: rootWidth,
      viewBox: '0 ' + (-colHeaderHeight) + ' ' + viewWidth + ' ' + (colHeaderHeight + viewHeight)
    });
    var colNum = colWidths.length;
    if (colNum !== rowHeights.length) {
      throw 'no match the number of col and row, col:' + colNum + ' row:' + row.length;
    }

    this._rootHeight = rootHeight;
    this._rootWidth = rootWidth;
    this._colNum = colNum;
    this._rowHeights = rowHeights;
    this._colWidths = colWidths;
    this._viewWidth = viewWidth;
    this._viewHeight = viewHeight;
    this._colHeaders = colHeaders;
    this._colHeaderHeight = colHeaderHeight;


    this.selectMode = utils.selectMode.horizontal(colNum);

    this._initTable();
  }

  utils.inherit(VerticalTable, Parent);

  (function (proto) {
    // private methods
    proto._initTable = function () {
      var that = this;
      var table = this.rootElem;
      var x = 0;
      this._colWidths.map(function (width, colNo) {
        var y = 0;
        var cols = that._rowHeights[colNo].map(function (height, rowNo) {
          var cell = that.createCell(rowNo, colNo, width, height);
          utils.translate(cell, 0, y);
          y += height;
          return cell;
        });
        var col = table.g();
        cols.map(function (c) {
          col.add(c)
        });
        utils.translate(col, x, 0);
        x += width;
        return col;
      });

      if (this._colHeaders) {
        x = 0;
        var headers = Snap(utils.createElement('g'));
        this._colWidths.map(function (width, colNo) {
          var header = that.createColHeader(colNo, width);
          utils.translate(header, x, 0);
          x += width;
          headers.add(header)
        });
        table.add(headers);
      }
    };
    // public methods
    proto.genColHeaderElem = function (col, width) {
      var header = Snap(utils.createElement('g'));
      header.rect(0, -this._colHeaderHeight, width, this._colHeaderHeight);
      header.text(width / 2, -this._colHeaderHeight, this._colHeaders[col]);
      return header;
    }
  })(VerticalTable.prototype);

  return VerticalTable;
});
TableSVG.addMode('Table', null, function (Parent, global, utils) {
  function Table(args) {
    var requiredArgs = [
      'rowHeights',
      'colWidths',
      'rootHeight',
      'rootWidth'
    ];

    var optionalArgs = [
      'colHeaderHeight',
      'colHeaders',
      'rowHeaderWidth',
      'rowHeaders'
    ];

    utils.checkArgs(requiredArgs, args);

    var rowHeights = args['rowHeights'];
    var colWidths = args['colWidths'];
    var rootHeight = args['rootHeight'];
    var rootWidth = args['rootWidth'];

    var rowNum = rowHeights.length;
    var colNum = colWidths.length;
    var viewWidth = utils.sum(colWidths);
    var viewHeight = utils.sum(rowHeights);

    this._colHeaders = args['colHeaders'];
    var colHeaderHeight = args['colHeaderHeight'] ? args['colHeaderHeight'] : 0;
    this._colHeaderHeight = colHeaderHeight;

    this._rowHeaders = args['rowHeaders'];
    var rowHeaderWidth = args['rowHeaderWidth'] ? args['rowHeaderWidth'] : 0;
    this._rowHeaderWidth = rowHeaderWidth;

    Parent.call(this, {
      rootHeight: rootHeight,
      rootWidth: rootWidth,
      viewBox: '' + (-rowHeaderWidth) + ' ' + (-colHeaderHeight) + ' ' + (viewWidth + rowHeaderWidth) + ' ' + (colHeaderHeight + viewHeight)
    });

    this._colWidths = colWidths;
    this._rowHeights = rowHeights;
    this._colNum = colNum;
    this._rowNum = rowNum;
    this._viewHeight = viewHeight;
    this._viewWidth = viewWidth;

    this.selectMode = utils.selectMode.horizontal(colNum);

    this._initTable();
  }

  utils.inherit(Table, Parent);
  (function (proto) {
    // private methods
    proto._initTable = function () {
      var that = this;
      var table = this.rootElem;
      var x, y;
      x = 0;
      this._colWidths.map(function (width, colNo) {
        y = 0;
        var cols = that._rowHeights.map(function (height, rowNo) {
          var cell = that.createCell(rowNo, colNo, width, height);
          utils.translate(cell, 0, y);
          y += height;
          return cell;
        });
        var col = table.g();
        cols.map(function (c) {
          col.add(c);
        });
        utils.translate(col, x, 0);
        x += width;
        return col;
      });

      if (this._colHeaders || this._rowHeaders) {
        var headers = Snap(utils.createElement('g'));
        if (this._colHeaders && this._rowHeaders) {
          var header = headers.g();
          header.rect(-this._rowHeaderWidth, -this._colHeaderHeight, this._rowHeaderWidth, this._colHeaderHeight);
          header.addClass(this.classes.header);
        }
        if (this._colHeaders) {
          x = 0;
          var colHeaders = Snap(utils.createElement('g'));
          this._colWidths.map(function (width, colNo) {
            var header = that.createColHeader(colNo, width);
            utils.translate(header, x, 0);
            x += width;
            colHeaders.add(header);
          });
          headers.add(colHeaders);
        }
        if (this._rowHeaders) {
          y = 0;
          var rowHeaders = Snap(utils.createElement('g'));
          this._rowHeights.map(function (height, rowNo) {
            var header = that.createRowHeader(rowNo, height);
            utils.translate(header, 0, y);
            y += height;
            rowHeaders.add(header);
          });
          headers.add(rowHeaders);
        }
        table.add(headers);
      }
    };
    // public methods
    proto.genColHeaderElem = function (col, width) {
      var header = Snap(utils.createElement('g'));
      header.rect(0, -this._colHeaderHeight, width, this._colHeaderHeight);
      header.text(width / 2, -this._colHeaderHeight, this._colHeaders[col]);
      return header;
    };
    proto.genRowHeaderElem = function (row, height) {
      var header = Snap(utils.createElement('g'));
      header.rect(-this._rowHeaderWidth, 0, this._rowHeaderWidth, height);
      header.text(-this._rowHeaderWidth / 2, height / 2, this._rowHeaders[row]);
      return header;
    }
  })(Table.prototype);
  return Table;
});
TableSVG.addMode('Calendar', 'Table', function (Parent, global, utils) {
  function Calendar(args) {
    var requiredArgs = [
      'startDate',
      'weekNum',
      'rootHeight',
      'rootWidth'
    ];

    var optionalArgs = [
      'colHeaderHeight'
    ];

    utils.checkArgs(requiredArgs, args);

    var rootHeight = args.rootHeight;
    var rootWidth = args.rootWidth;

    var startDate = args.startDate;
    var weekNum = args.weekNum;
    var endDate = new Date(startDate.getTime());
    endDate.setDate(7 * (weekNum - 1) + endDate.getDate());

    var getLatestMonday = function (date, deltaDate) {
      if (!deltaDate) {
        deltaDate = 0
      }
      var delta = 7 - (7 + date.getDay() - 1) % 7;
      var res = new Date(date.getTime());
      res.setDate(date.getDate() + delta + deltaDate);
      return res;
    };

    var tableStartDate = getLatestMonday(startDate, -7); // Monday
    var tableEndDate = getLatestMonday(endDate, -1); // Sunday

    var colHeaderHeight = args.colHeaderHeight ? args.colHeaderHeight : 20;
    this._colHeaderHeight = colHeaderHeight;

    this._tableStartDate = tableStartDate;
    this._tableEndDate = tableEndDate;

    (function () {
      var rowHeights = [];
      for (var i = weekNum; i > 0; i--) {
        rowHeights.push(30)
      }
      Parent.call(this, {
        colHeaderHeight: colHeaderHeight,
        colWidths: [40, 40, 40, 40, 40, 40, 40],
        rowHeights: rowHeights,
        rootHeight: rootHeight,
        rootWidth: rootWidth,
        colHeaders: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      });
    }).call(this);
  }

  utils.inherit(Calendar, Parent);

  (function (proto) {
    proto.genCellElem = function (row, col, width, height) {
      var cell = Snap(utils.createElement('g'));
      var currDate = new Date(this._tableStartDate.getTime());
      currDate.setDate(row * 7 + col + currDate.getDate());
      cell.rect(0, 0, width, height);
      cell.text(0, 0, currDate.getDate());
      cell.data('year', currDate.getFullYear());
      cell.data('month', currDate.getMonth());
      cell.data('day', currDate.getDate());
      return cell;
    };
    proto.getActiveDates = function () {
      var activeCells = this.getActiveCells();
      return activeCells.map(function (c) {
        return new Date(c.data('year'), c.data('month'), c.data('day'));
      });
    }
  })(Calendar.prototype);
  return Calendar;
});
