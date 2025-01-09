import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user)
      res.status(404).json({
        message: "No user find with the id",
      });
    else {
      res.status(200).json({
        user,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
    console.log("Error in usercontroller", error);
  }
};

export const followUnfollowProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, req.user._id);
    const userTobeFollowed = await User.findById(id).select("-password");
    const userFollowing = await User.findById(req.user._id).select("-password");

    if (id === req.user._id.toString())
      return res.status(400).json({
        message: "You cant follow yourself",
      });

    if (!userTobeFollowed || !userFollowing)
      return res.status(400).json({
        message: "User not found!",
      });

    const isFollowing = userFollowing.following.includes(id);

    if (isFollowing) {
      //Unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      return res.status(200).json({
        message: "User unfollowed successfully",
      });
    } else {
      //Follow the user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      return res.status(200).json({
        message: "User followed successfully",
      });
    }
  } catch (error) {
    console.log("Error in userController", error);
  }
};
