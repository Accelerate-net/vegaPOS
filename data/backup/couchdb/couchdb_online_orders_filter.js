{
  "_id": "_design/filter-by",
  "_rev": "9-61d48d0c7115f7b340658ba42cc9d09b",
  "views": {
    "status": {
      "map": "function (doc) {\n  if(doc.onlineStatus, doc.systemDate){\n    emit([doc.onlineStatus, doc.systemDate], doc.onlineOrder);\n  }\n}",
      "reduce": "_count"
    }
  },
  "language": "javascript"
}