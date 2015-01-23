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
      'colHeaderHeight',
      'rowHeaders',
      'rowHeaderWidth',
      'rowHeaderHeights'
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
    var rowHeaders = args['rowHeaders'];
    var rowHeaderWidth = args['rowHeaderWidth'] ? args['rowHeaderWidth'] : 0;
    var rowHeaderHeights = args['rowHeaderHeights'] ? args['rowHeaderHeights'] : [];
    
    args.additionalClasses = {
      corner: 'corner'
    };

    Parent.call(this, utils.mergeHash({
      rootHeight: rootHeight,
      rootWidth: rootWidth,
      viewBox: (-rowHeaderWidth) + ' ' + (-colHeaderHeight) + ' ' + (viewWidth + rowHeaderWidth) + ' ' + (colHeaderHeight + viewHeight)
    }, args));
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
    this._rowHeaders = rowHeaders;
    this._rowHeaderWidth = rowHeaderWidth;
    this._rowHeaderHeights = rowHeaderHeights;


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

      if (this._colHeaders || this._rowHeaders) {
        var headers = Snap(utils.createElement('g'));
        if (this._colHeaders && this._rowHeaders) {
          var header = headers.g();
          header.rect(-this._rowHeaderWidth, -this._colHeaderHeight, this._rowHeaderWidth, this._colHeaderHeight);
          header.addClass(this.classes.header);
          header.addClass(this.classes.corner);
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
          var y = 0;
          var rowHeaders = Snap(utils.createElement('g'));
          this._rowHeaderHeights.map(function (height, rowNo) {
            var header = that.createRowHeader(rowNo, height);
            y += height;
            utils.translate(header, 0, y);
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
      header.rect(-this._rowHeaderWidth, -height, this._rowHeaderWidth, height);
      header.text(-this._rowHeaderWidth / 2, -height / 2, this._rowHeaders[row]);
      return header;
    };
  })(VerticalTable.prototype);

  return VerticalTable;
});