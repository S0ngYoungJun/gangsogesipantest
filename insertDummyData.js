import mongoose, { Schema, models } from "mongoose";
const memberModel = require('@/models/member'); // 모델 경로를 확인하세요
const { connectMongoDB } = require('@/lib/mongodb'); // MongoDB 연결 함수 경로를 확인하세요

// MongoDB에 연결
connectMongoDB();

const dummyData = [
  {
    _id: new mongoose.Types.ObjectId(),
    NO: "1",
    관리자아이디: "admin01",
    관리자명: "홍길동",
    관리서비스: "서비스1",
    등록일: new Date(),
    비밀번호: "password123",
    관리자권한: 1
  },
  {
    _id: new mongoose.Types.ObjectId(),
    NO: "2",
    관리자아이디: "admin02",
    관리자명: "이순신",
    관리서비스: "서비스2",
    등록일: new Date(),
    비밀번호: "password456",
    관리자권한: 2
  },
  {
    _id: new mongoose.Types.ObjectId(),
    NO: "3",
    관리자아이디: "admin03",
    관리자명: "강감찬",
    관리서비스: "서비스3",
    등록일: new Date(),
    비밀번호: "password789",
    관리자권한: 3
  }
];

// 더미 데이터를 MongoDB에 삽입하는 함수
async function insertDummyData() {
  try {
    await  memberModel.insertMany(dummyData);
    console.log("더미 데이터가 성공적으로 추가되었습니다.");
  } catch (error) {
    console.error("더미 데이터 추가 중 오류가 발생했습니다:", error);
  } finally {
    mongoose.disconnect();
  }
}

// 함수 실행
insertDummyData();