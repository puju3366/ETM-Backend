import { result } from "lodash";
import { Types } from "mongoose";
const { Modules } = require('./rightsSchema')
const { Rights } = require('./rightsSchema')

export class RightsUtils {
    request: any;
    public async getModule(req: any) {
        return await Modules.find();
    }
    public async getRights(req: any) {
        // { status: { $in: [1, 0] } }).sort({ 'createdAt': -1 }
        const reqArr = [{
            $match: {
                status: { $in: [1, 0] }
            }
        },
        {
            $lookup: {
                from: 'modules',
                localField: 'moduleID',
                foreignField: '_id',
                as: 'rights'
            }
        }
        ];
        req.reqArr = reqArr;
        return await Rights.aggregate(req.reqArr).exec();
    }

    public async createRight(rightDetail: Json) {
        const right = new Rights(rightDetail);
        return await right.save();
    }

    public async createSlug(req: any) {
        const moduledata = req.moduledata.split(" ")
        const number = moduledata.length
        const module = moduledata.splice(1, number)
        let text = "";
        function slug(item, index) {
            text += item.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        module.forEach(slug);
        const slugName = text + "/" + req.rightname.toLowerCase();
        return slugName;
    }
    public async getById(req: any) {
        const reqArr = [
            {
                $match: {
                    '_id': Types.ObjectId(req.params.id),
                },
            },
        ]
        return await Rights.aggregate(reqArr).exec();
    }
    public async updateRightData(req: any) {
        req.body.updated_date = new Date();
        return await Rights.findByIdAndUpdate(req.params.id, req.body, { new: true })
    }
    public async getModuleById(req: any) {
        const reqArr = [
            {
                $match: {
                    '_id': Types.ObjectId(req.body.moduleID),
                },
            },
        ]
        return await Modules.aggregate(reqArr).exec();
    }
}