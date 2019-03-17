{
  "_id": "_design/print-requests",
  "views": {
    "fetchall": {
      "map": "function (doc) {\n  emit(doc._id, doc);\n}"
    }
  },
  "language": "javascript"
}