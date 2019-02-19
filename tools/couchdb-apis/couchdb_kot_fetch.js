{
  "_id": "_design/kot-fetch",
  "views": {
    "fetchbytype": {
      "map": "function (doc) {\n  emit([doc.orderDetails.modeType], doc);\n}"
    }
  },
  "language": "javascript"
}