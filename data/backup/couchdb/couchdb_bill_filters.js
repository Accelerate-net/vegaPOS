{
  "_id": "_design/bill-filters",
  "_rev": "13-d69d5dfa66fcc060297907180c468b8e",
  "views": {
    "filterbydiscount": {
      "map": "function (doc) {\n  if(doc.date){\n    if(doc.discount.amount){\n      emit(['discounted', doc.date], doc);\n    }\n    else{\n      emit(['nondiscounted', doc.date], doc);\n    }\n  }\n}"
    },
    "filterbymachine": {
      "map": "function (doc) {\n  if(doc.machineName && doc.date){\n    emit([doc.machineName, doc.date], doc);\n  }\n}"
    },
    "filterbymobile": {
      "map": "function (doc) {\n  if(doc.customerMobile && doc.date){\n    emit([doc.customerMobile, doc.date], doc);\n  }\n}"
    },
    "filterbybillingmode": {
      "map": "function (doc) {\n  if(doc.orderDetails.mode && doc.date){\n    emit([doc.orderDetails.mode, doc.date], doc);\n  }\n}"
    },
    "filterbysession": {
      "map": "function (doc) {\n  if(doc.sessionName && doc.date){\n    emit([doc.sessionName, doc.date], doc);\n  }\n}"
    },
    "filterbystewardname": {
      "map": "function (doc) {\n  if(doc.stewardName && doc.date){\n    emit([doc.stewardName, doc.date], doc);\n  }\n}"
    },
    "filterbytable": {
      "map": "function (doc) {\n  if(doc.table && doc.orderDetails.modeType =='DINE' && doc.table != 'None' && doc.date){\n    emit([doc.table, doc.date], doc);\n  }\n}"
    },
    "filterbypaymentmode": {
      "map": "function (doc) {\n  if(doc.paymentMode && doc.date){\n    emit([doc.paymentMode, doc.date], doc);\n  }\n}"
    },
    "showall": {
      "map": "function (doc) {\n  if(doc.date){\n    emit([doc.date], doc);\n  }\n}"
    },
    "filterbyrefund": {
      "map": "function (doc) {\n  if(!doc.refundDetails){\n    emit(['norefund', doc.date], doc);\n  }\n  else if(doc.refundDetails.status && doc.refundDetails.amount && doc.date){\n    if(doc.refundDetails.status == 3){\n      emit(['fullrefund', doc.date], doc);\n    }\n    else if(doc.refundDetails.status == 2){\n      emit(['partialrefund', doc.date], doc);\n    }\n  }\n}"
    }
  },
  "language": "javascript"
}