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

    var lackArgs = requiredArgs.filter(function (elem) {
      return args === undefined || args[elem] === undefined
    }).join(', ');
    if (lackArgs.length > 0) {
      throw 'NoRequiredArgument: ' + lackArgs;
    }

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

      x = 0;
      var headers = Snap(utils.createElement('g'));
      this._colWidths.map(function (width, colNo) {
        var header = that.createColHeader(colNo, width);
        utils.translate(header, x, 0);
        x += width;
        headers.add(header)
      });
      table.add(headers);

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