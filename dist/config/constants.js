"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
class Constants {
}
exports.Constants = Constants;
Constants.TIME_STAMP_FORMAT = "YYYY-MM-DD HH:mm:ss";
Constants.SUCCESS = "Success";
Constants.FAIL = "Fail";
Constants.FAIL_CODE = 400;
Constants.BAD_DATA = "BAD_DATA";
Constants.CODE = "CODE";
Constants.UPLOAD_SIZES = { PROFILE_PICTURE: 2000000 };
Constants.RECORDS_PER_PAGE = 20;
Constants.RANDOM_CODE_STR_LENGTH = 6;
Constants.DATE_FORMAT = "YYYY-MM-DD HH:mm";
Constants.SES_API_VERSION = "";
Constants.SNS_API_VERSION = "2010-03-31";
Constants.DEVICE_TYPES = {
    IOS: "ios",
};
Constants.ROLES = {
    Admin: 1,
    SubAdmin: 2,
    User: 3
};
Constants.UPLOAD_TYPES = { PROFILE_PICTURE: "PROFILE_PICTURE", AUDIO_FILE: "AUDIO_FILE" };
Constants.TIME_FORMAT = "HH:mm:ss";
Constants.EXPIRY_MINUTES = 5;
Constants.INTERNAL_SERVER = 500;
Constants.INVALID_CREDENTIAL = 401;
Constants.NOT_FOUND = 404;
Constants.OK = 200;
// public static readonly SOCKET_EVENTS = {
//     EMIT_GROUP_MESSAGE: "emitGroupMessage",
//     ON_GROUP_MESSAGE_ACK: "onGroupMessageAck",
//     EMIT_JOIN_ROOM: "emitJoinRoom",
//     ON_JOIN_ROOM_ACK: "onJoinRoomAck",
//     EMIT_LEAVE_ROOM: "emitLeaveRoom",
//     ON_LEAVE_ROOM_ACK: "onLeaveRoomAck",
//     CONNECT: "connection",
//     DISCONNECT: "disconnect",
//     SOCKET_ERROR: "onSocketError",
//     ON_NEW_GROUP_MESSAGE: "onNewGroupMessage",
//     EMIT_DELETE_GROUP: "emitDeleteGroup",
//     ON_DELETE_GROUP: "onDeleteGroup",
//     EMIT_SOUND_MESSAGE: "emitSoundMessage",
//     ON_SOUND_MESSAGE: "onSoundMessage",
// };
Constants.CHAT_SOUND_INTERVAL_MS = 1000;
//# sourceMappingURL=constants.js.map