import { Constants } from "../config/constants";
import * as moment from "moment";
import * as dotenv from "dotenv";
import bcrypt = require('bcryptjs');
import * as querystring from 'querystring';
import * as request from 'request';
dotenv.config();

const saltRounds = 10;
export class Utils {
    /** Creating 6 digit random code for otp as well as referral code */
     public static createRandomcode = (length: number, isOTP: boolean) => {
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
    }

    /** get regex for multiple names in sql (instead of LIKE) */
    public static getRegex = (data: string[], symbol: string = '|') => {
        return `REGEXP '${data.join(",").replace(/'/g, "\\'").replace(",", symbol)}'`;
    }

    /* convert returned string object from sql result to array of objects */
    public static formatStringObjectsToArrayObjects = (result: any, type: string) => {
        if (result[type]) {
            result[type] = JSON.parse(result[type]);
        } else {
            result[type] = [];
        }
        return result[type];
    }

    /* Get image path for attachment */
    public static getImagePath = (atchId: string, atchName: string) => {
        return `IF(${atchId} IS NULL, '', CONCAT('${process.env.IMAGE_PATH}', '/', ${atchName}))`;
    }

    /* Get Timestamop of date */
    public static getTimeStamp = (date: string) => {
        return moment(date).unix();
    }

    /* Get round of 2 digit */
    public static getRoundOfTwoDigit = (value: number) => {
        return +value.toFixed(2);
    }

    public static async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /** get skip and limit to avoid multiple code lines */
    public static getSkipLimit = (page: number, recordsPerPage: number = null) => {
        let skip = 0;
        const limit = recordsPerPage ? recordsPerPage : Constants.RECORDS_PER_PAGE; // for paginate records
        if (page) {
            skip = (page - 1) * limit;
        }
        return { limit, skip };
    }

    /** get time format */
    public static getTimeFormat = () => {
        return moment().format(Constants.TIME_FORMAT);
    }

    /** get date format with adding extra minutes */
    public static getStandardDateFormatWithAddedMinutes = (value: number) => {
        return moment().add(value, "minutes").format(Constants.DATE_FORMAT)
    }

    public static encryptText = (text) => {
        return bcrypt.hash(text, saltRounds);
    };
    public static genSalt = (req:any) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (_err, hash) => {
                return hash;
            })
        });
    };

    public static compareEncryptedText = (text, hashText) => {
        return bcrypt.compare(text, hashText);
    };

    public static empty = (mixedVar) => {
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
    public static async convertQueryMongo(conditionObj) {
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
                                isNaN(new Date(rule.value) as any)) ? Date.parse(rule.value) : rule.value,
                        },
                    },
                };
            } else if (rule.operator === 'in') {
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
            } else if (rule.operator === '!=') {
                return {
                    'user_inputs': {
                        '$elemMatch': {
                            'question._id': rule.field,
                            'answer._id': {
                                $ne: Array.isArray(rule.value) ? rule.value[0] : (!Number.isInteger(rule.value) &&
                                    !isNaN(new Date(rule.value) as any)) ? Date.parse(rule.value) : rule.value,
                            },
                        },
                    },
                };
            } else if (rule.operator === 'not in') {
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
            } else if (rule.operator === '<') {
                return {
                    'user_inputs': {
                        '$elemMatch': {
                            'question._id': rule.field,
                            'answer._id': {
                                $lt: Array.isArray(rule.value) ? rule.value[0] : (!Number.isInteger(rule.value) &&
                                    !isNaN(new Date(rule.value) as any)) ? Date.parse(rule.value) : rule.value,
                            },
                        },
                    },
                };
            } else if (rule.operator === '>') {
                return {
                    'user_inputs': {
                        '$elemMatch': {
                            'question._id': rule.field,
                            'answer._id': {
                                $gt: Array.isArray(rule.value) ? rule.value[0] : (!Number.isInteger(rule.value) &&
                                    !isNaN(new Date(rule.value) as any)) ? Date.parse(rule.value) : rule.value,
                            },
                        },
                    },
                };
            } else if (rule.operator === '<=') {
                return {
                    'user_inputs': {
                        '$elemMatch': {
                            'question._id': rule.field,
                            'answer._id': {
                                $lte: Array.isArray(rule.value) ? rule.value[0] : (!Number.isInteger(rule.value) &&
                                    !isNaN(new Date(rule.value) as any)) ? Date.parse(rule.value) : rule.value,
                            },
                        },
                    },
                };
            } else if (rule.operator === '>=') {
                return {
                    'user_inputs': {
                        '$elemMatch': {
                            'question._id': rule.field,
                            'answer._id': {
                                $gte: Array.isArray(rule.value) ? rule.value[0] : (!Number.isInteger(rule.value) &&
                                    !isNaN(new Date(rule.value) as any)) ? Date.parse(rule.value) : rule.value,
                            },
                        },
                    },
                };
            }
        };
        const mapRuleSet = (ruleSet) => {
            if (ruleSet.rules && ruleSet.rules.length > 0) {
                return {
                    [conditions[ruleSet.condition]]: ruleSet.rules.map(
                        (rule) => rule.operator ? mapRule(rule) : mapRuleSet(rule)
                    ),
                };
            } else {
                return null;
            }
        };
        const mongoDbQuery = {
            cond: await mapRuleSet(conditionObj)
        };
        return mongoDbQuery;
    } 
    public static requestApi(opt) {
        return request(opt);
    }
    public static reverseString(str) {
        return str.split('').reverse().join('');
    }

    public static toUpper(str:any) {
        return str.trim()
          .toLowerCase()
          .split(' ')
          .map(function (word:any) {
            return word[0].toUpperCase() + word.substr(1);
          })
          .join(' ');
      }

    public static convertToSlug(Text)
    {
        return Text
            .toLowerCase()
            .replace(/ /g,'-')
            .replace(/[^\w-]+/g,'')
            ;
    }
}
