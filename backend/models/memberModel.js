import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
  providerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  fullname: { 
    type: String, 
    required: true,
    trim: true 
  },
  role: { 
    type: String, 
    required: true 
  }, 
  phonenumber: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String,
    lowercase: true,
    trim: true
  },
  profilePic: { 
    type: String, 
    default: "" 
  },
  profilePicPublicId: { 
    type: String, 
    default: "" 
  },
  status: { 
    type: String, 
    default: "active", 
    enum: ["active", "on_leave", "inactive"] 
  }
}, { timestamps: true });

const Member = mongoose.model("Member", MemberSchema);
export default Member;