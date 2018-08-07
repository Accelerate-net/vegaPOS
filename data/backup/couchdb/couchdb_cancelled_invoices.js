{
  "_id": "_design/invoices",
  "_rev": "2-aa673078aed611a1e98eeec99c69873f",
  "views": {
    "bydate": {
      "map": "function (doc) {\n  if(doc.dateStamp){\n    emit(doc.dateStamp, doc);\n  }\n}"
    },
    "all": {
      "map": "function (doc) {\n  emit(doc.billNumber, doc);\n}"
    },
    "filterbymode": {
      "map": "function (doc) {\n  if(doc.paymentMode){\n    emit(doc.paymentMode, doc);\n  }\n  \n}"
    }
  },
  "language": "javascript"
}