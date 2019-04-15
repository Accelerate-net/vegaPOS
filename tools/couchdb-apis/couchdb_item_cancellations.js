{
  "_id": "_design/cancellation-summary",
  "views": {
    "itemscount": {
      "map": "function(doc) {\n  if(doc.dateStamp) {\n    doc.itemsRemoved.forEach(function(item) {\n      var category = \"UNKNOWN\";\n      if(item.category){\n        category = item.category;\n      }\n      \n      if(item.isCustom){\n        emit([doc.dateStamp, category, item.name, item.variant, item.price], item.qty);\n      }\n      else{\n        emit([doc.dateStamp, category, item.name, \"\", item.price], item.qty);\n      }\n    });\n  }\n}",
      "reduce": "function (keys, values) {\n  return sum(values);\n}"
    },
    "fetchall": {
      "map": "function(doc) {\n  emit([doc.dateStamp], doc);\n}"
    }
  },
  "language": "javascript"
}