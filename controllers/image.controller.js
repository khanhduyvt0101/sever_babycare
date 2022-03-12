import response from '../models/response.model.js'

async function upload(file) {
    let standardRes = response
    if (file === undefined) {
        standardRes.status = 400
        standardRes.message = 'you must select a file.'
    } else {
        standardRes.status = 200
        standardRes.data = `http://localhost:${process.env.PORT}/baby/image/${file.id}`
    }
    return standardRes;
}

export default {
    upload
}