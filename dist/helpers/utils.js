"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const constants_1 = require("../config/constants");
const moment = require("moment");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const request = require("request");
dotenv.config();
const saltRounds = 10;
class Utils {
    static delay(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    }
    static convertQueryMongo(conditionObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const conditions = {
                'and': '$and',
                'or': '$or'
            };
            // const mapRule = rule => ({
            //      [operators[rule.operator]]: [ ""+rule.field, rule.value ]
            // });
            const mapRule = (rule) => {
                // console.log(Date.parse(rule.value));
                if (rule.operator === '=') {
                    return {
                        'user_inputs': {
                            '$elemMatch': {
                                'question._id': rule.field,
                                'answer._id': Array.isArray(rule.value) ? rule.value[0] : (!Number.isInteger(rule.value) &&
                                    isNaN(new Date(rule.value))) ? Date.parse(rule.value) : rule.value,
                            },
                        },
                    };
                }
                else if (rule.operator === 'in') {
                    return {
                        'user_inputs': {
                            '$elemMatch': {
                                'question._id': rule.field,
                                'answer._id': {
                                    $in: Array.isArray(rule.value) ? rule.value : rule.value[0]
                                },
                            },
                        },
                    };
                }
                else if (rule.operator === '!=') {
                    return {
                        'user_inputs': {
                            '$elemMatch': {
                                'question._id': rule.field,
                                'answer._id': {
                                    $ne: Array.isArray(rule.value) ? rule.value[0] : (!Number.isInteger(rule.value) &&
                                        !isNaN(new Date(rule.value))) ? Date.parse(rule.value) : rule.value,
                                },
                            },
                        },
                    };
                }
                else if (rule.operator === 'not in') {
                    return {
                        'user_inputs': {
                            '$elemMatch': {
                                'question._id': rule.field,
                                'answer._id': {
                                    $nin: Array.isArray(rule.value) ? rule.value : rule.value[0]
                                },
                            },
                        },
                    };
                }
                else if (rule.operator === '<') {
                    return {
                        'user_inputs': {
                            '$elemMatch': {
                                'question._id': rule.field,
                                'answer._id': {
                                    $lt: Array.isArray(rule.value) ? rule.value[0] : (!Number.isInteger(rule.value) &&
                                        !isNaN(new Date(rule.value))) ? Date.parse(rule.value) : rule.value,
                                },
                            },
                        },
                    };
                }
                else if (rule.operator === '>') {
                    return {
                        'user_inputs': {
                            '$elemMatch': {
                                'question._id': rule.field,
                                'answer._id': {
                                    $gt: Array.isArray(rule.value) ? rule.value[0] : (!Number.isInteger(rule.value) &&
                                        !isNaN(new Date(rule.value))) ? Date.parse(rule.value) : rule.value,
                                },
                            },
                        },
                    };
                }
                else if (rule.operator === '<=') {
                    return {
                        'user_inputs': {
                            '$elemMatch': {
                                'question._id': rule.field,
                                'answer._id': {
                                    $lte: Array.isArray(rule.value) ? rule.value[0] : (!Number.isInteger(rule.value) &&
                                        !isNaN(new Date(rule.value))) ? Date.parse(rule.value) : rule.value,
                                },
                            },
                        },
                    };
                }
                else if (rule.operator === '>=') {
                    return {
                        'user_inputs': {
                            '$elemMatch': {
                                'question._id': rule.field,
                                'answer._id': {
                                    $gte: Array.isArray(rule.value) ? rule.value[0] : (!Number.isInteger(rule.value) &&
                                        !isNaN(new Date(rule.value))) ? Date.parse(rule.value) : rule.value,
                                },
                            },
                        },
                    };
                }
            };
            const mapRuleSet = (ruleSet) => {
                if (ruleSet.rules && ruleSet.rules.length > 0) {
                    return {
                        [conditions[ruleSet.condition]]: ruleSet.rules.map((rule) => rule.operator ? mapRule(rule) : mapRuleSet(rule)),
                    };
                }
                else {
                    return null;
                }
            };
            const mongoDbQuery = {
                cond: yield mapRuleSet(conditionObj)
            };
            return mongoDbQuery;
        });
    }
    static requestApi(opt) {
        return request(opt);
    }
    static reverseString(str) {
        return str.split('').reverse().join('');
    }
    static toUpper(str) {
        return str.trim()
            .toLowerCase()
            .split(' ')
            .map(function (word) {
            return word[0].toUpperCase() + word.substr(1);
        })
            .join(' ');
    }
    static convertToSlug(Text) {
        return Text
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }
}
exports.Utils = Utils;
/** Creating 6 digit random code for otp as well as referral code */
Utils.createRandomcode = (length, isOTP) => {
    let code = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // for referral code generator
    if (isOTP) {
        characters = "123456789"; // for otp generator
    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return code;
};
/** get regex for multiple names in sql (instead of LIKE) */
Utils.getRegex = (data, symbol = '|') => {
    return `REGEXP '${data.join(",").replace(/'/g, "\\'").replace(",", symbol)}'`;
};
/* convert returned string object from sql result to array of objects */
Utils.formatStringObjectsToArrayObjects = (result, type) => {
    if (result[type]) {
        result[type] = JSON.parse(result[type]);
    }
    else {
        result[type] = [];
    }
    return result[type];
};
/* Get image path for attachment */
Utils.getImagePath = (atchId, atchName) => {
    return `IF(${atchId} IS NULL, '', CONCAT('${process.env.IMAGE_PATH}', '/', ${atchName}))`;
};
/* Get Timestamop of date */
Utils.getTimeStamp = (date) => {
    return moment(date).unix();
};
/* Get round of 2 digit */
Utils.getRoundOfTwoDigit = (value) => {
    return +value.toFixed(2);
};
/** get skip and limit to avoid multiple code lines */
Utils.getSkipLimit = (page, recordsPerPage = null) => {
    let skip = 0;
    const limit = recordsPerPage ? recordsPerPage : constants_1.Constants.RECORDS_PER_PAGE; // for paginate records
    if (page) {
        skip = (page - 1) * limit;
    }
    return { limit, skip };
};
/** get time format */
Utils.getTimeFormat = () => {
    return moment().format(constants_1.Constants.TIME_FORMAT);
};
/** get date format with adding extra minutes */
Utils.getStandardDateFormatWithAddedMinutes = (value) => {
    return moment().add(value, "minutes").format(constants_1.Constants.DATE_FORMAT);
};
Utils.encryptText = (text) => {
    return bcrypt.hash(text, saltRounds);
};
Utils.genSalt = (req) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (_err, hash) => {
            return hash;
        });
    });
};
Utils.compareEncryptedText = (text, hashText) => {
    return bcrypt.compare(text, hashText);
};
Utils.empty = (mixedVar) => {
    let i;
    let len;
    const emptyValues = ['undefined', null, 'null', false, 0, '', '0', undefined];
    for (i = 0, len = emptyValues.length; i < len; i += 1) {
        if (mixedVar === emptyValues[i]) {
            return true;
        }
    }
    if (typeof mixedVar === 'object') {
        const keys = Object.keys(mixedVar);
        return keys.length === 0;
    }
    return false;
};
//# sourceMappingURL=utils.js.map