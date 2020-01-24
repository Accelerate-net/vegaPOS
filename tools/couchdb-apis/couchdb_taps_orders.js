{
  "_id": "_design/orders",
  "views": {
    "view": {
      "map": "function (doc) {\n  emit(doc._id, 1);\n}"
    }
  },
  "language": "javascript"
}