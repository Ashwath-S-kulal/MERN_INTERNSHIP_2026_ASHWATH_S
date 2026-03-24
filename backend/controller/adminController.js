import { ServiceProvider } from "../models/serviceProviderModel.js";
import { User } from "../models/userModel.js";

export const getPendingProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find({ status: "pending" })
      .populate("user", "firstName email");

    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find({})
      .populate("user", "firstName lastName email profilePic") 
      .sort({ createdAt: -1 });

    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateProviderStatus = async (req, res) => {
    try {
    const { id } = req.params;
    const provider = await ServiceProvider.findById(id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider application not found",
      });
    }
    provider.status = "approved";
    provider.isActive = false;
    await provider.save();
    await User.findByIdAndUpdate(provider.user, {
      role: "provider",
    });

    res.json({
      success: true,
      message: "Provider application approved and service access granted.",
    });

  } catch (err) {
    console.error(" Rejection Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error during rejection",
      error: err.message,
    });
  }
};

export const rejectProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; 
    const provider = await ServiceProvider.findById(id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider application not found",
      });
    }
    provider.status = "rejected";
    provider.isActive = false;

    await provider.save();
    res.json({
      success: true,
      message: "Provider application rejected and user access restricted.",
    });

  } catch (err) {
    console.error(" Rejection Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error during rejection",
      error: err.message,
    });
  }
};

export const allUser= async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      users,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

export const updateUser= async (req, res) => {
  try {
    
    const userIdToUpdate =  req.params.id;
    const loggedInUser= req.user;
    const { firstName, lastName, address, city, zipCode,phoneNo,role } = req.body;
    
    if(loggedInUser._id.toString() !== userIdToUpdate && loggedInUser.role !== 'admin'){
      return res.status(403).json({
        success:false,
        message:"You are not authorized to update this user"
      });
    }
    let user = await User.findById(userIdToUpdate);
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      });
    }  
    
    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;
    
    // If a new profile picture is uploaded, update the URL and public ID
    if (req.file) {
      if(profilePicPublicId){
        //delete the previous image from cloudinary
        await cloudinary.uploader.destroy(profilePicPublicId);
      }
      const uploadResult = await new Promise((resolve, reject) => {
        const stream= cloudinary.uploader.upload_stream(
          { folder: 'profiles' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
          
        )
        stream.end(req.file.buffer);
      });
      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    user.phoneNo = phoneNo || user.phoneNo;
    user.role = role || user.role;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser =  await user.save();
    return res.status(200).json({
      success:true,
      message:"Profile Updated Successfully",
      user:updatedUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can delete only your account!' });
    }

    await Promise.all([
      Cart.deleteMany({ userId: userId }),    
      Wishlist.deleteMany({ userId: userId }), 
      Order.deleteMany({ userId: userId }),    
    ]);

    await User.findByIdAndDelete(userId);

    return res.status(200).json({ 
      success: true, 
      message: 'User and all associated data (cart, wishlist, orders) have been deleted.' 
    });

  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};