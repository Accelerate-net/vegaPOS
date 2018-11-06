{
  "_id": "_design/order-summary",
  "views": {
    "itemsCount": {
      "map": "function(doc) {\n  if(doc.dateStamp && doc.cart) {\n    doc.cart.forEach(function(item) {\n      var category = \"UNKNOWN\";\n      if(item.category){\n        category = item.category;\n      }\n      emit([doc.dateStamp, category, item.name], item.qty);\n    });\n  }\n}\n\n",
      "reduce": "function (keys, values) {\n  return sum(values);\n}"
    }
  },
  "language": "javascript"
}