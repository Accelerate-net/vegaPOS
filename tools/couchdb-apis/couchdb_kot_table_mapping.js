{
  "_id": "_design/table-mapping",
  "views": {
    "fetchdineorders": {
      "map": "function (doc) {\n  if(doc.orderDetails.modeType == 'DINE')\n    emit(doc.table, doc);\n}"
    },
    "fetchnondineorders": {
      "map": "function (doc) {\n  if(doc.orderDetails.modeType != 'DINE')\n    emit(doc.table, doc);\n}"
    }
  },
  "language": "javascript"
}