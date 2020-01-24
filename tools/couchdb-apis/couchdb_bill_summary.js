{
  "_id": "_design/bill-summary",
  "views": {
    "sumbytotalpayable": {
      "reduce": "_stats",
      "map": "function (doc) {\n  if(doc.payableAmount && doc.date){\n     emit([doc.date], doc.payableAmount);\n  }\n}\n"
    }
  },
  "language": "javascript"
}