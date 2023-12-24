exports.getData = async (req, res) => {
  try {
    res.status(200).json({message: 'get Api'});
  } catch (err) {
    console.log(err);
  }
};

exports.addData = (req, res) => {
  try {
    res.status(200).json({message: 'post Api'});
  } catch (err) {
    console.log(err);
  }
};
exports.updateData = async (req, res) => {
  const { name } = req.body;
  try {
    res.status(200).json({message: 'update Api'});
  } catch (err) {
    console.log(err);
  }
};
exports.deleteData = async (req, res) => {
  try {
    res.status(200).json({message: 'delete Api'});
  } catch (err) {
    console.log(err);
  }
};
