import { Document, Schema, model } from 'mongoose';



export interface Expense extends Document {
    id:string;
    category:String;
    title:string;
    cost: number;
    time: Date;

}


const ExpenseSchema = new Schema<Expense>({

  category: {
    type: String,
    enum: { values: ["Entertainment", "Transport", "Groceries", "Shopping", "Other"], message: '{VALUE} is not supported' },
    required:[true,"missing required field category"]
  },
  title: {
    type: String,
    required: [true,"missing required field title"]
  },
  cost: {
    type: Number,
    default:0,
    min: [0, 'Cost cannot be less than 0']
  },
  time:{
    type: Date,
    immutable:true
  }
 
})

ExpenseSchema.pre('save', function(next) {

  this.time = new Date()
  next();
});


ExpenseSchema.virtual('id').get(function(){
  return this._id.toHexString();
});


ExpenseSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   
    delete ret._id 
   }
});







export const ExpenseModel = model<Expense>("Expense", ExpenseSchema);