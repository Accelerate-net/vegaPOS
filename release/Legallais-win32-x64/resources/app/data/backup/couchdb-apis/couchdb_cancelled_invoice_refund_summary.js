{
  "_id": "_design/refund-summary",
  "views": {
    "sumbyrefundmodes": {
      "map": "function (doc) {\n  if(doc.refundDetails.amount && doc.dateStamp && doc.refundDetails.mode){\n    emit([doc.refundDetails.mode, doc.dateStamp], doc.refundDetails.amount);\n  }\n}",
      "reduce": "_stats"
    },
    "allrefunds": {
      "map": "function (doc) {\n  if(doc.refundDetails.amount && doc.dateStamp){\n    emit([doc.dateStamp], doc.refundDetails.amount);\n  }\n}",
      "reduce": "_stats"
    }
  },
  "language": "javascript"
}