{
  "_id": "_design/kot-fetch",
  "views": {
    "fetchbytype": {
      "map": "function (doc) {\n  emit([doc.orderDetails.modeType], doc);\n}"
    },
    "fetchall": {
      "map": "function (doc) {\n  if(doc.KOTNumber && doc.KOTNumber != '')\n    emit(doc.table, doc);\n}"
    },
    "fetchbytable": {
      "map": "function (doc) {\n  if(doc.orderDetails.modeType == \"DINE\")\n    emit([doc.table], doc);\n}"
    }
  },
  "language": "javascript"
}