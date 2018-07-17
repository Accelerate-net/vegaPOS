{
  "_id": "_design/invoices",
  "_rev": "12-d2d5de4c58941e794e92b7238d9d2b51",
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