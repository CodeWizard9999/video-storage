class MainError extends Error {
  constructor(error = 'Unknown error', errorCode = 'UNKNOWN_ERROR', status = 400) {
    super();
    this.error = error;
    this.errorCode = errorCode;
    this.status = status;
  }
}

class CriticalError extends MainError {
  constructor(error, errorCode, status) {
    super();
    this.error = error;
    this.errorCode = errorCode;
    this.status = status;
    this.isCritical = true;
  }
}

class BaseError extends MainError {
  constructor(error, errorCode, status) {
    super();
    this.error = error;
    this.errorCode = errorCode;
    this.status = status;
    this.isCritical = false;
  }
}

class InternalApiError extends CriticalError {
  constructor(error = 'internal server error') {
    super(error, 'INTERNAL_SERVER_ERROR', 500);
  }
}

class RefreshTokenNotFoundError extends BaseError {
  constructor(error = 'refresh token not found') {
    super(error, 'DATABASE_ERROR', 404);
  }
}

class SameUserExistError extends BaseError {
  constructor(error = 'user with same email or login already exist') {
    super(error, 'DATABASE_ERROR', 409);
  }
}

class WrongEmailError extends BaseError {
  constructor(error = 'passed wrong email') {
    super(error, 'DATABASE_ERROR', 403);
  }
}

class WrongPasswordError extends BaseError {
  constructor(error = 'passed wrong password') {
    super(error, 'DATABASE_ERROR', 403);
  }
}

class UserNotUpdatedError extends BaseError {
  constructor(error = 'user is not updated') {
    super(error, 'DATABASE_ERROR', 400);
  }
}

class VerificationCodeInvalidError extends BaseError {
  constructor(error = 'verification code doesn\'t match') {
    super(error, 'DATABASE_ERROR', 406);
  }
}
class VideoIsNotRelatedToThisUserError extends BaseError {
  constructor(error = 'this video is not related to this user') {
    super(error, 'DATABASE_ERROR', 403);
  }
}

class UserNotFoundError extends BaseError {
  constructor(error = 'user not found') {
    super(error, 'DATABASE_ERROR', 404);
  }
}

class TokenError extends BaseError {
  constructor(error = 'Unknown error') {
    super(error, 'TOKEN_SERVICE_ERROR', 401);
  }
}

class MissedAuthHeaderError extends BaseError {
  constructor(error = 'MISSED_AUTHORIZATION_HEADER') {
    super(error, 'MISSED_AUTH_HEADER', 401);
  }
}

class MissedTokenError extends BaseError {
  constructor(error = 'MISSED_AUTHORIZATION_TOKEN') {
    super(error, 'MISSED_AUTH_TOKEN', 401);
  }
}
class InvalidTokenError extends BaseError {
  constructor(error = 'INVALID_AUTHORIZATION_TOKEN') {
    super(error, 'INVALID_AUTH_TOKEN', 401);
  }
}

class VideosNotFoundError extends BaseError {
  constructor(error = 'Videos not found') {
    super(error, 'VIDEO_NOT_FOUND_ERROR', 404);
  }
}

class ValidationError extends BaseError {
  constructor(error = 'Unknown Validation Error') {
    super(error, 'VALIDATION_ERROR', 422);
  }
}

class ValidationArrayOfErrors extends BaseError {
  constructor(error = []) {
    super(error, 'VALIDATION_ERROR', 422);
  }
}

class UploadingFileIsMissingError extends BaseError {
  constructor(error = 'uploading file is missing') {
    super(error, 'VALIDATION_ERROR', 422);
  }
}

class UploadingFileTypeIsInvalidError extends BaseError {
  constructor(error = 'don\'t support this type of file') {
    super(error, 'VALIDATION_ERROR', 422);
  }
}

class RoleIsNotExistError extends BaseError {
  constructor(error = 'such role is not exist yet') {
    super(error, 'ROLE_ERROR', 404);
  }
}

class PermissionNotFindError extends BaseError {
  constructor(error = 'such permission is not exist yet') {
    super(error, 'PERMISSION_ERROR', 404);
  }
}

class AccessDeniedError extends BaseError {
  constructor(error = 'access denied fro this role') {
    super(error, 'PERMISSION_ERROR', 401);
  }
}

class VideoNotAddedToS3 extends BaseError {
  constructor(error = 'error with adding video to s3') {
    super(error, 'ADDING_VIDEO_TO_S3_ERROR', 401);
  }
}
class VideoDidNotDeleteFromS3 extends BaseError {
  constructor(error = 'error with adding video to s3') {
    super(error, 'DELETING_VIDEO_FROM_S3_ERROR', 401);
  }
}

module.exports = {
  BaseError,
  TokenError,
  ValidationError,
  UploadingFileIsMissingError,
  UploadingFileTypeIsInvalidError,
  MissedAuthHeaderError,
  MissedTokenError,
  InvalidTokenError,
  InternalApiError,
  SameUserExistError,
  WrongEmailError,
  WrongPasswordError,
  RefreshTokenNotFoundError,
  UserNotUpdatedError,
  VerificationCodeInvalidError,
  UserNotFoundError,
  VideoIsNotRelatedToThisUserError,
  VideosNotFoundError,
  ValidationArrayOfErrors,
  RoleIsNotExistError,
  PermissionNotFindError,
  AccessDeniedError,
  VideoNotAddedToS3,
  VideoDidNotDeleteFromS3
};
