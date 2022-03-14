import response from '../models/response.model.js'
import User from '../models/user.model.js'
import _ from 'lodash'

async function user(id) {
    let standardRes = _.cloneDeep(response)
    await User.find({ _id: id }).then((data) => {
        if (!data.length) {
            standardRes.status = 400
            standardRes.message = 'Not find idAccount in database'
        }
    }).catch((err) => {
        standardRes.status = 500
        standardRes.message = err
    })
    if (Object.keys(standardRes.message).length === 0) {
        return null
    }
    return standardRes
}

export default {
    user
}