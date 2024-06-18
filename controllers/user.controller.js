const userController = {};

userController.createUser = async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

module.exports = userController;
