{
  "_id": "_design/names",
  "_rev": "1-1062717efe3114f8957ce6b5055695b8",
  "views": {
    "names": {
      "map": "function(doc) {\n    if (doc.name) {\n        emit(doc.name, doc);\n    }\n}"
    }
  },
  "language": "javascript"
}