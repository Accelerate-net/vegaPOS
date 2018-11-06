{
  "_id": "_design/kot-summary",
  "views": {
    "sumbycart": {
      "map": "function (doc) {\n  if(doc.cart[0].name){\n    var n = 0;\n    while(doc.cart[n]){\n      emit([doc.KOTNumber], parseInt(doc.cart[n].price));\n      n++;\n    }\n  }\n}",
      "reduce": "_stats"
    },
    "sumbyextras": {
      "map": "function (doc) {\n  if(doc.extras[0].amount){\n    var n = 0;\n    while(doc.extras[n]){\n      emit([doc.KOTNumber], doc.extras[n].amount);\n      n++;\n    }\n  }\n}",
      "reduce": "_stats"
    }
  },
  "language": "javascript"
}