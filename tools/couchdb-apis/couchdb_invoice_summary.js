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
    }
  },
  "language": "javascript"
}