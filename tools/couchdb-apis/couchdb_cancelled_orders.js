{
  "_id": "_design/orders",
  "views": {
    "all": {
      "map": "function (doc) {\n  emit(doc.KOTNumber, doc);\n}"
    }
  },
  "language": "javascript"
}