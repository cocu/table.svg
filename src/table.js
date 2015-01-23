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

    Parent.call(this, utils.mergeHash({
      rootHeight: rootHeight,
      rootWidth: rootWidth,
      viewBox: '' + (-rowHeaderWidth) + ' ' + (-colHeaderHeight) + ' ' + (viewWidth + rowHeaderWidth) + ' ' + (colHeaderHeight + viewHeight)
    }, args));

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