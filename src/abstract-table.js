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
    tlproto.genRowHeaderElem = function (row, height) {
    };
    tlproto.genColHeaderElem = function (col, width) {
    };
    tlproto.genCellElem = function (row, col, width, height) {
      var cell = Snap(utils.createElement('g'));
      cell.rect(0,0,width,height);
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
  utils.checkArgs = function(requiredArgs, args){
    var lackArgs = requiredArgs.filter(function (elem) {
      return args === undefined || args[elem] === undefined
    }).join(', ');
    if (lackArgs.length > 0) {
      throw 'NoRequiredArgument: ' + lackArgs;
    }
  };
  utils.logger = logger;
  utils.selectMode = selectMode;

  return TableSVG;
})();