import cloudinary from "cloudinary"; // Ensure your cloudinary config is imported
import Member from "../models/memberModel.js";

export const addmember = async (req, res) => {
  try {
    const { fullname, role, phonenumber, email } = req.body;
    const providerId = req.user._id;

    let profilePicUrl = "";
    let profilePicPublicId = "";

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { folder: "members" }, 
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }

    const newMember = new Member({
      providerId,
      fullname,
      role,
      phonenumber,
      email,
      profilePic: profilePicUrl,
      profilePicPublicId: profilePicPublicId,
    });

    await newMember.save();

    res.status(201).json({ 
      success: true, 
      message: "Member added to your group!", 
      member: newMember 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getmember = async (req, res) => {
  try {
    const members = await Member.find({ providerId: req.user._id });
    res.json({ success: true, members });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}


export const deleteMember = async (req, res) => {
  try {
    const id = req.params.id;
    
    const member = await Member.findById(id);
    
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    if (member.profilePicPublicId) {
      await cloudinary.v2.uploader.destroy(member.profilePicPublicId);
    }

    await Member.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true, 
      message: "Member and associated data removed successfully" 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.json({
      success: true,
      member,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};