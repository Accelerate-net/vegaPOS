{
  "_id": "_design/invoice-summary",
  "views": {
    "sumbybillingmode": {
      "reduce": "_stats",
      "map": "function (doc) {\n  if(doc.orderDetails.mode && doc.dateStamp){\n    emit([doc.orderDetails.mode, doc.dateStamp], doc.totalAmountPaid);\n  }\n}"
    },
    "sumbypaymentmode": {
      "reduce": "_stats",
      "map": "function (doc) {\n  if(doc.paymentMode && doc.dateStamp){\n    emit([doc.paymentMode, doc.dateStamp], doc.totalAmountPaid);\n  }\n}"
    },
    "sumbypaymentmode_multiple": {
      "map": "function (doc) {\n  if(doc.paymentMode == 'MULTIPLE' && doc.dateStamp){\n    var n = 0;\n    while(doc.paymentSplits[n]){\n      emit([doc.paymentSplits[n].code, doc.dateStamp], doc.paymentSplits[n].amount);\n      n++;\n    }\n    \n  }\n}",
      "reduce": "_stats"
    },
    "sumbyextras": {
      "map": "function (doc) {\n  if(doc.extras[0].name && doc.dateStamp){\n    var n = 0;\n    while(doc.extras[n]){\n      emit([doc.extras[n].name, doc.dateStamp], doc.extras[n].amount);\n      n++;\n    }\n  }\n}",
      "reduce": "_stats"
    },
    "sumbyextras_custom": {
      "map": "function (doc) {\n  if(doc.customExtras.type && doc.dateStamp){\n    emit([doc.customExtras.type, doc.dateStamp], doc.customExtras.amount);\n  }\n}",
      "reduce": "_stats"
    },
    "sumbydiscounts": {
      "map": "function (doc) {\n  if(doc.discount.type && doc.dateStamp){\n     emit([doc.discount.type, doc.dateStamp], doc.discount.amount);\n  }\n}\n",
      "reduce": "_stats"
    },
    "grandtotal_paidamount": {
      "reduce": "_stats",
      "map": "function (doc) {\n  if(doc.totalAmountPaid && doc.dateStamp){\n     emit([doc.dateStamp], doc.totalAmountPaid);\n  }\n}\n"
    },
    "grandtotal_roundoff": {
      "reduce": "_stats",
      "map": "function (doc) {\n  if(doc.dateStamp && doc.roundOffAmount){\n     emit([doc.dateStamp], doc.roundOffAmount);\n  }\n}\n"
    },
    "grandtotal_discounts": {
      "reduce": "_stats",
      "map": "function (doc) {\n  if(doc.dateStamp && doc.discount.amount){\n     emit([doc.dateStamp], doc.discount.amount);\n  }\n}\n"
    },
    "grandtotal_tips": {
      "reduce": "_stats",
      "map": "function (doc) {\n  if(doc.dateStamp && doc.tipsAmount){\n     emit([doc.dateStamp], doc.tipsAmount);\n  }\n}\n"
    },
    "sumbybillingandpaymentmodes": {
      "reduce": "_stats",
      "map": "function (doc) {\n  if(doc.paymentMode && doc.dateStamp && doc.orderDetails.mode){\n    emit([doc.orderDetails.mode, doc.paymentMode, doc.dateStamp], doc.totalAmountPaid);\n  }\n}"
    },
    "sumbybillingandpaymentmodes_multiple": {
      "map": "function (doc) {\n  if(doc.paymentMode == 'MULTIPLE' && doc.dateStamp && doc.orderDetails.mode){\n    var n = 0;\n    while(doc.paymentSplits[n]){\n      emit([doc.orderDetails.mode, doc.paymentSplits[n].code, doc.dateStamp], doc.paymentSplits[n].amount);\n      n++;\n    }\n    \n  }\n}\n\n",
      "reduce": "_stats"
    },
    "sumbyrefundmodes_splitbyextras": {
      "map": "function (doc) {\n  if(doc.extras[0].name && doc.orderDetails.mode && doc.dateStamp){\n    var n = 0;\n    while(doc.extras[n]){\n      emit([doc.orderDetails.mode, doc.extras[n].name, doc.dateStamp], doc.extras[n].amount);\n      n++;\n    }\n  }  \n}",
      "reduce": "_stats"
    },
    "sumbyrefundmodes_splitbycustomextras": {
      "map": "function (doc) {\n  if(doc.customExtras.type && doc.orderDetails.mode && doc.dateStamp){\n    emit([doc.orderDetails.mode, doc.customExtras.type, doc.dateStamp], doc.customExtras.amount);\n  }  \n}",
      "reduce": "_stats"
    },
    "totalguests": {
      "map": "function (doc) {\n  if(doc.guestCount && doc.dateStamp){\n     emit([doc.dateStamp], doc.guestCount);\n  }\n}\n",
      "reduce": "_stats"
    },
    "sessionwisesales": {
      "map": "function(doc) {\n  if(doc.dateStamp) {\n      var session = \"Unknown\";\n      if(doc.sessionName && doc.sessionName != \"\"){\n        session = doc.sessionName;\n      }\n      \n      if(doc.guestCount && doc.guestCount != \"\"){\n        emit([doc.dateStamp, session, doc.guestCount], doc.totalAmountPaid);\n      }\n      else{\n        emit([doc.dateStamp, session, 0], doc.totalAmountPaid);\n      }\n  }\n}"
    },
    "timeslotwise_averagetimespent": {
      "map": "function(doc) {\n  \n  /*\n    To find the avg. time spent in the restaurant. \n    Applicable only for DINE orders.\n  */\n  if(doc.orderDetails.modeType == \"DINE\"){\n    var time_in = (doc.timePunch).toString();\n    var time_out = (doc.timeBill).toString();\n   \n    var time_in_hour = time_in.substr(0, 2);\n    var time_in_min = time_in.substr(2, 2);\n    \n    var time_out_hour = time_out.substr(0, 2);\n    var time_out_min = time_out.substr(2, 2);\n    \n    var inDate = new Date(\"October 13, 2014 \"+time_in_hour+\":\"+time_in_min+\":00\");\n    var outDate;\n    \n    if(time_out_hour < time_in_hour){ //add next day\n      outDate = new Date(\"October 14, 2014 \"+time_out_hour+\":\"+time_out_min+\":00\");\n    }\n    else{\n      outDate = new Date(\"October 13, 2014 \"+time_out_hour+\":\"+time_out_min+\":00\");\n    }\n    \n    var difference = (outDate.getTime() - inDate.getTime()) / 1000;\n    difference = difference / 60;\n    \n    difference = difference == 0 ? 1 : difference;\n    \n    var parts = (doc.date).split('-');\n    var billDate = new Date(parts[2], parts[1] - 1, parts[0]); \n\n\n    emit([doc.dateStamp, billDate.getDay()], difference);\n  }\n}"
    },
    "timeslotwise_countoverall": {
      "map": "function(doc) {\n  \n  var time_in = (doc.timePunch).toString();\n  var time_in_hour = parseInt(time_in.substr(0, 2));\n  \n  var count = 0;\n  if(doc.guestCount && doc.guestCount != \"\"){\n    count = doc.guestCount;\n  }\n  \n  emit([\"ANY_MODE\", doc.dateStamp, time_in_hour], count);\n}"
    },
    "timeslotwise_countbymode": {
      "map": "function(doc) {\n  \n  var time_in = (doc.timePunch).toString();\n  var time_in_hour = parseInt(time_in.substr(0, 2));\n  \n  var count = 0;\n  if(doc.guestCount && doc.guestCount != \"\"){\n    count = doc.guestCount;\n  }\n  \n  emit([doc.orderDetails.mode, doc.dateStamp, time_in_hour], count);\n}"
    }
  },
  "language": "javascript"
}