const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai'
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit'
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang'
  ),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan username dan password'
  ),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'username dan password harus string'
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'NEW_THREAD.PROPERTY_NOT_FOUND': new InvariantError(
    'tidak dapat tambah thread baru, properti tidak di temukan'
  ),
  'NEW_THREAD.INCCORECT_TYPE_DATA': new InvariantError(
    'tidak dapat tambah thread baru, tipe data tidak sesuai'
  ),
  'ADD_THREAD.PROPERTY_NOT_FOUND': new InvariantError(
    'tidak dapat tampil data thread, property tidak di temukan'
  ),
  'ADD_THREAD.INCCORECT_TYPE_DATA': new InvariantError(
    'tidak dapat tampil data thread, tipe data tidak sesuai'
  ),
  'NEW_COMMENT.PROPERTY_NOT_FOUND': new InvariantError(
    'tidak dapat tambah komentar thread baru, properti tidak di temukan'
  ),
  'NEW_COMMENT.INCCORECT_TYPE_DATA': new InvariantError(
    'tidak dapat tambah komentar thread baru, tipe data tidak sesuai'
  ),
  'ADD_COMMENT.PROPERTY_NOT_FOUND': new InvariantError(
    'tidak dapat tampil data komentar thread, property tidak di temukan'
  ),
  'ADD_COMMENT.INCCORECT_TYPE_DATA': new InvariantError(
    'tidak dapat tampil data komentar thread, tipe data tidak sesuai'
  ),
  'NEW_REPLY.PROPERTY_NOT_FOUND': new InvariantError(
    'tidak dapat tambah balasan komentar baru, properti tidak di temukan'
  ),
  'NEW_REPLY.INCCORECT_TYPE_DATA': new InvariantError(
    'tidak dapat tambah balasan komentar baru, tipe data tidak sesuai'
  ),
  'ADD_REPLY.PROPERTY_NOT_FOUND': new InvariantError(
    'tidak dapat tampil data balasan komentar, property tidak di temukan'
  ),
  'ADD_REPLY.INCCORECT_TYPE_DATA': new InvariantError(
    'tidak dapat tampil data balasan komentar, tipe data tidak sesuai'
  ),
};

module.exports = DomainErrorTranslator;
