{
  "_id": "_design/refund-summary",
  "_rev": "1-b861a3d863be0f35fcf7fd9765c0dc3c",
  "views": {
    "sumbyrefundmodes": {
      "reduce": "_stats",
      "map": "function (doc) {\n  if(doc.refundDetails.amount && doc.dateStamp && doc.refundDetails.mode){\n    emit([doc.refundDetails.mode, doc.dateStamp], doc.refundDetails.amount);\n  }\n}"
    }
  },
  "language": "javascript"
}