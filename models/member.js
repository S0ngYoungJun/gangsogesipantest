import mongoose, { Schema, models } from "mongoose";

const memberSchema = new Schema(
  {
    NO: {
      type: String,
      required: true,
    },
    관리자아이디: {
      type: String,
      required: true,
    },
    관리자명: {
      type: String,
      required: true,
    },
    관리자서비스: {
      type: String,
      required: true,
    },
    등록일: {
      type: String,
      required: true,
    },
    비밀번호: {
      type: String,
      required: true,
    },
    관리자권한: {
      type: Number,
      required: true,
    },

  },
  { timestamps: true }
);

const Member = models.Member || mongoose.model("Member", memberSchema);
export default Member;
