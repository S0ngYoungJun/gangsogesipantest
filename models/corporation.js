import mongoose,{ Schema, models } from 'mongoose';

const corporationSchema = new Schema({
  companyName: { type: String, required: true },
  businessNumber: { type: String, required: true , unique: true,},
  location: { type: String, required: true },
  contact: { type: String, required: true },
  fax: { type: String, required: true },
  representativeName: { type: String, required: true },
  department: { type: String, required: true },
  repContact: { type: String, required: true, unique: true },
  repEmail: { type: String, required: true}
});

const Corporation = models.Corporation|| mongoose.model('Corporation', corporationSchema);
export default Corporation;