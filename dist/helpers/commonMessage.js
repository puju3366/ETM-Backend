"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModule = void 0;
exports.MessageModule = {
    'message': {
        'invalid_token': 'Token is invalid',
        'record_not_found': 'Record not found!',
        'something_went_wrong': 'Something went wrong!',
        'success': 'success',
        "notFound": "data not found",
        "delete": "deleted successfully",
        'invalid_parameter': 'Invalid parameter passed!',
        'incorrect_password': 'Password incorrect',
        'admin_login_error': 'Sorry! Only Admin can login here.',
        'password_changed': 'Password Changed Successfully!',
        'password_not_match_record': 'Old Password does not match with our record!',
        'password_not_match': 'New Password and Confirm Password does not match!',
        'email_exist': 'Email is already exists',
        'phone_exist': 'Mobile number is already exists',
        'social_media_id_exist': 'You already registered with social media.',
        'not_authorised': 'Sorry! You are not authorised',
        'went_wrong': 'Something Went Wrong!',
        'invalid_character': '<Entity> cannot have character other than <extra>',
        'minimun_character': '<Entity> must have at least <extra> characters.',
        'maximum_character': '<Entity> cannot exceed more than <extra> characters.',
        'required': 'Please specify <Entity>',
        'check_blank_space': 'Please specify <Entity>',
        'invalid_email_address': '<Entity> should allow only '
            + 'the special characters <extra> ',
        'invalid_email_format': 'Text entered doesn\'t seem to be a valid <Entity>',
        'invalid_phone': '<Entity> should allow only the '
            + 'special characters <extra>',
        'invalid_character_password': '<Entity> contains Invalid Characters',
        'blank_space_password': '<Entity> contains Invalid Characters',
        'mismatch_password': 'Password and Confirmation Password should be same',
        'invalid_zip': '<Entity> should allow only the special characters <extra> ',
        'wrong_digit': '<Entity> should have <extra> digits only',
        'record_inserted': '<Entity> has been already inserted',
        'added': '<Entity> has been added successfully',
        'updated': '<Entity> has been updated successfully',
        'deleted': '<Entity> has been deleted successfully',
        'retrived': '<Entity> has been retrived successfully',
    },
    'status': {
        'ok': 200,
        'error': 500,
        'not_found': 404,
        'not_content': 204,
        'unauthorized': 401,
    },
    'required'(msgKey, entity, extra) {
        return this.message[msgKey].replace('<Entity>', entity).
            replace('<extra>', extra);
    },
};
//# sourceMappingURL=commonMessage.js.map