{
  "_id": "_design/search",
  "views": {
    "searchUser": {
      "map": "function(doc) { \n  if (doc.mobile) { \n    emit([doc.mobile], {\"name\":doc.name,\"mobile\":doc.mobile});\n  }\n} "
    }
  },
  "language": "javascript"
}