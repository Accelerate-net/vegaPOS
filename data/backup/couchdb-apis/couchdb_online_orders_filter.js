{
  "_id": "_design/filter-by",
  "views": {
    "status": {
      "map": "function (doc) {\n  if(doc.onlineStatus, doc.systemDate){\n    emit([doc.onlineStatus, doc.systemDate], doc.onlineOrder);\n  }\n}",
      "reduce": "_count"
    }
  },
  "language": "javascript"
}