router.put('/updateUser/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let updates = {};

    if (req.body.name) {
      updates.name = req.body.name;
    }

    if (req.body.email) {
      updates.email = req.body.email;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});