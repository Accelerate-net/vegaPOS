{
  "_id": "_design/names",
  "views": {
    "names": {
      "map": "function(doc) {\n    if (doc.name) {\n        emit(doc.name, doc);\n    }\n}"
    }
  },
  "language": "javascript"
}