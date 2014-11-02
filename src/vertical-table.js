TableSVG.addMode('vertical-table', 'table', function (Parent, global, _) {
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