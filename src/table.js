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
      'colHeaders'
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

    var colHeaders = args['colHeaders'];
    this._colHeaders = colHeaders;
    var colHeaderHeight = args['colHeaderHeight'] ? args['colHeaderHeight'] : 0;
    this._colHeaderHeight = colHeaderHeight;

    Parent.call(this, {
      rootHeight: rootHeight,
      rootWidth: rootWidth,
      viewBox: '0 ' + (-colHeaderHeight) + ' ' + viewWidth + ' ' + (colHeaderHeight + viewHeight)
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
      var x = 0;
      this._colWidths.map(function (width, colNo) {
        var y = 0;
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
  })(Table.prototype);
  return Table;
});