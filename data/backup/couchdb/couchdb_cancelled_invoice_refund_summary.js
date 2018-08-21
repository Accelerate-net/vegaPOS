{
  "_id": "_design/refund-summary",
  "_rev": "5-f4fb48bcc13e8f69d83fd949d80fd338",
  "views": {
    "sumbyrefundmodes": {
      "map": "function (doc) {\n  if(doc.refundDetails.amount && doc.dateStamp && doc.refundDetails.mode){\n    emit([doc.refundDetails.mode, doc.dateStamp], doc.refundDetails.amount);\n  }\n}",
      "reduce": "_stats"
    }
  },
  "language": "javascript"
}