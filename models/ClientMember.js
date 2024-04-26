import mongoose, { Schema, models } from "mongoose";

const clientmemberSchema = new Schema(
  {
    memberId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const clientMembers = models.clientMember || mongoose.model("clientMembers", clientmemberSchema);
export default  clientMembers ;
