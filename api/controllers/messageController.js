export const getUserMessage = async (req, res) => {
  try {
    res.status(200).json({
      message: 'done',
    });
  } catch (error) {
    console.log(error);
  }
};
