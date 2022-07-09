

const fs = require("fs");
const csv = require('csv')


export class CSV {

  model: any
  constructor(model: any) {
    this.model = model
  }



  generateAllCSV = async () => {

    const documents = this.model.aggregate(
      [
        // stage 1 - prepare the documents according to an expression for the next stage 

        {

          $group: {
            _id: null,
            sum: { $sum: "$cost" },
            expenses: { $push: { id: "$_id", category: "$category", title: "$title", time: "$time", cost: "$cost" } }
          }
        },

        // stage 2 - desconstruct the expenses model with $unwind
        {
          $unwind: {
            path: "$expenses",

          }
        },

        // stage 3 - remove default mongodb _id field from input (optional)
        { $unset: ["_id"] },

        // stage 4 - project fields
        {
          $project: {
            id: "$expenses.id",
            cost: "$expenses.cost",
            category: "$expenses.category",
            title: "$expenses.title",
            percentage: { $round: [{ $multiply: [{ $divide: ["$expenses.cost", "$sum"] }, 100] }, 3] },
            time: "$expenses.time"
          }
        },

      ]
    )



    const transformData = (doc: any) => {

      return {
        ID: doc.id.toString(),
        Category: doc.category,
        Title: doc.title,
        Cost: doc.cost,
        percentage: doc.percentage,
        Time: doc.time.toISOString()



      };
    }


    // name of file when downloaded
    const filename = `src/reports/items-${Date.now()}.csv`
    const writableStream = fs.createWriteStream(filename);
    // stream response through pipes with CSV transformation
    documents.cursor().pipe(csv.transform(transformData)).pipe(csv.stringify({header: true})).pipe(writableStream)
    return { message: 'Report 1 successfully created' }

  }


  generateCategoryCSV = async () => {
    const documents = this.model.aggregate(
      [
        {

          $group: {
            _id: null,
            sum: { $sum: "$cost" },
            data: { "$push": "$$ROOT" }

          }
        },
        {
          $unwind: "$data"
        },
        { "$group": { "_id": "$data.category", cost: { $sum: "$data.cost" }, "total": { "$first": "$sum" } } },


        {
          $project: {

            
            Category: "$_id",
            Cost: "$cost",
            Percentage: { $round: [{ $multiply: [{ $divide: ["$cost", "$total"] }, 100] }, 3] }
          }

        },
        { $unset: ["_id"] },


      ]
    )

  
    // name of file when downloaded
    const filename = `src/reports/categories-${Date.now()}.csv`
    const writableStream = fs.createWriteStream(filename);
    // stream response through pipes with CSV transformation
    documents.cursor().pipe(csv.stringify({header:true})).pipe(writableStream)

 

  }




}

