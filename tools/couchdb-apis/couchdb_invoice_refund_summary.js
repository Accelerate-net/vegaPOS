{
  "_id": "_design/refund-summary",
  "views": {
    "allrefunds": {
      "reduce": "_stats",
      "map": "function (doc) {\n  if(doc.refundDetails.amount && doc.dateStamp){\n    emit([doc.dateStamp], doc.refundDetails.amount);\n  }\n}"
    },
    "sumbyrefundmodes": {
      "reduce": "_stats",
      "map": "function (doc) {\n  if(doc.refundDetails.amount && doc.dateStamp && doc.refundDetails.mode){\n    emit([doc.refundDetails.mode, doc.dateStamp], doc.refundDetails.amount);\n  }\n}"
    },
    "allrefunds_netamount": {
      "reduce": "_stats",
      "map": "function (doc) {\n  if(doc.refundDetails.amount && doc.dateStamp){\n    emit([doc.dateStamp], doc.refundDetails.netAmount);\n  }\n}"
    },
    "fetchall": {
      "map": "function (doc) {\n  if(doc.refundDetails.amount && doc.dateStamp){\n    emit([doc.dateStamp], doc);\n  }\n}"
    }
  },
  "language": "javascript"
}