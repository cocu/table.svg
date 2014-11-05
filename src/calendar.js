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

    var tableStartDate = new getLatestMonday(startDate, -7); // Monday
    var tableEndDate = new getLatestMonday(endDate, -1); // Sunday

    var colHeaderHeight = args.colHeaderHeight ? args.colHeaderHeight : 20;
    this._colHeaderHeight = colHeaderHeight;

    this._tableStartDate = tableStartDate;
    this._tableEndDate = tableEndDate;

    (function () {
      var rowHeights = [];
      for (var i = weekNum; i--;) {
        rowHeights.push(30)
      }
      Parent.call(this, {
        colHeaderHeight: colHeaderHeight,
        colWidths: [40, 40, 40, 40, 40, 40, 40],
        rowHeights: rowHeights,
        rootHeight: rootHeight,
        rootWidth: rootWidth,
        colHeaders: ['月', '火', '水', '木', '金', '土', '日']
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
      return cell;
    }
  })(Calendar.prototype);
  return Calendar;
});