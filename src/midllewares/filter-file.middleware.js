const { UploadingFileIsMissingError, UploadingFileTypeIsInvalidError } = require('../services/errors.service');

module.exports = (req, res, next) => {
  const file = req.files.video_file;
  if (!file) throw new UploadingFileIsMissingError();

  const fileType = req.files.video_file.type;
  if (fileType !== 'video/mp4') throw new UploadingFileTypeIsInvalidError();

  return next();
};
