{
  "_id": "_design/bills",
  "_rev": "1-bf28b783e2496e6690866d4753f3de72",
  "views": {
    "all": {
      "map": "function (doc) {\n  emit(doc.billNumber, doc);\n}"
    }
  },
  "language": "javascript"
}