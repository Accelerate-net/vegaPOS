{
  "_id": "_design/filter-tables",
  "views": {
    "all": {
      "map": "function (doc) {\n  emit(parseInt(doc._id), doc);\n}"
    },
    "filterbyname": {
      "map": "function (doc) {\n  emit([doc.table], doc);\n}"
    },
    "filterbysection": {
      "map": "function (doc) {\n  emit([doc.type], doc);\n}"
    },
    "filterbyKOT": {
      "map": "function (doc) {\n  if(doc.KOT != \"\" && doc.status == 1)\n    emit([doc.KOT], doc);\n}"
    },
    "filterbysavedorders": {
      "map": "function (doc) {\n  if(doc.status == 5 && doc.assigned == 'Hold Order')\n    emit([doc._id], doc);\n}"
    },
    "filterbylive": {
      "map": "function (doc) {\n  if(doc.status == 1)\n    emit(doc.table, doc);\n}"
    }
  },
  "language": "javascript"
}