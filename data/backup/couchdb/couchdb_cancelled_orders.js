{
  "_id": "_design/orders",
  "_rev": "2-f4dbaaf21e039309678c6a5669245d45",
  "views": {
    "all": {
      "map": "function (doc) {\n  emit(doc.KOTNumber, doc);\n}"
    }
  },
  "language": "javascript"
}