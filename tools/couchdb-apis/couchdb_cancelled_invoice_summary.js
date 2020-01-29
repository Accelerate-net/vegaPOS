{
  "_id": "_design/invoice-summary",
  "views": {
    "sumbypaymentstatus": {
      "reduce": "_stats",
      "map": "function (doc) {\n  if(doc.dateStamp && doc.orderDetails.mode && doc.payableAmount)\n  {\n    \n    var payment_status = \"UNPAID\";\n    \n     if(doc.timeSettle != \"\"){\n      payment_status = \"PAID\";\n     }\n     \n     emit([payment_status, doc.dateStamp], doc.payableAmount);\n\n    \n    \n  }\n}"
    },
    "sumbybillingmode": {
      "reduce": "_stats",
      "map": "function (doc) {\n  if(doc.dateStamp && doc.orderDetails.mode && doc.payableAmount)\n    emit([doc.orderDetails.mode, doc.dateStamp], doc.payableAmount);\n}"
    },
    "fetchall": {
      "map": "function (doc) {\n  if(doc.dateStamp){\n    emit([doc.dateStamp], doc);\n  }\n}"
    }
  },
  "language": "javascript"
}