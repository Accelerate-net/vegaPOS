{
  "_id": "_design/search",
  "_rev": "2-34b2599edddd20f52bdbf3dfccef3600",
  "views": {
    "searchUser": {
      "map": "function(doc) { \n  if (doc.mobile) { \n    emit([doc.mobile], {\"name\":doc.name,\"mobile\":doc.mobile});\n  }\n} "
    }
  },
  "language": "javascript"
}