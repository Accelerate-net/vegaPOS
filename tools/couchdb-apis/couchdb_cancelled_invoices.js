{
  "_id": "_design/invoices",
  "views": {
    "bydate": {
      "map": "function (doc) {\n  if(doc.dateStamp){\n    emit(doc.dateStamp, doc);\n  }\n}"
    },
    "all": {
      "map": "function (doc) {\n  emit(doc.billNumber, doc);\n}"
    },
    "filterbymode": {
      "map": "function (doc) {\n  if(doc.paymentMode){\n    emit(doc.paymentMode, doc);\n  }\n  \n}"
    },
    "getcount": {
      "map": "function (doc) {\n  if(doc.dateStamp){\n    emit([doc.dateStamp], doc.billNumber);\n  }\n}",
      "reduce": "_count"
    }
  },
  "language": "javascript"
}