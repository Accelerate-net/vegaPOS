{
  "_id": "_design/bills",
  "views": {
    "all": {
      "map": "function (doc) {\n  emit(doc.billNumber, doc);\n}"
    }
  },
  "language": "javascript"
}