{
  "_id": "_design/order-summary",
  "views": {
    "itemsCount": {
      "reduce": "function (keys, values) {\n  return sum(values);\n}",
      "map": "function(doc) {\n  if(doc.dateStamp && doc.cart) {\n    doc.cart.forEach(function(item) {\n      var category = \"UNKNOWN\";\n      if(item.category){\n        category = item.category;\n      }\n      \n      if(item.isCustom){\n        emit([doc.dateStamp, category, item.name, item.variant], item.qty);\n      }\n      else{\n        emit([doc.dateStamp, category, item.name, \"\"], item.qty);\n      }\n    });\n  }\n}"
    }
  },
  "language": "javascript"
}