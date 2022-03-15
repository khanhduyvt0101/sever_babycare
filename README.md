# Server REST API of BabyCare App
## Setup development
### Install
 - node: 16.13.2 or newer
 - npm: 8.1.2 or newer
### Execute commands:
 - `npm install`: Update package for project code.
 - `npm start`: Run server.
 ## Development commands
 `node -v`: Check version node.
## API Document
### Host
 - URL using REST API: http://localhost:3001 (PORT = 3001)
### EndPoint
#### Image for Baby
 - POST: /baby/image/upload `uploadImage`
    + req: body: {
        file: fileImage.png/.jpg
    }
    + res: {
        status:'',
        data:'id of image',// save local to use get image
        message:''
    }

- GET: /baby/image/:id  `get image by id image`
    + req: no body
    + res: {
        status:'',
        data:'readStream.data',// using gridfsBucket to pipe data
        message:''
    }

- DELETE: /baby/image/:filename `delete image by file name`
    + req: no body
    + res: {
        status:'',
        data:'',
        message:''
    }

#### Baby
 - GET: /baby/:idAccount   `Get all baby by idAccount`
    + req: no body
    + res: {
        status:'',
        data:'',
        message:''
    }

 - POST: /baby/add `Create Baby`
    + req: {
        birth: '',
        gender: '',
        name: '',
        idAccount: '',
        idImage: '',
    }
    + res: {
        status:'',
        data:'',
        message:''
    }

- PUT: /baby/update/:id `Update Baby`
    + req: {
        birth: '',
        gender: '',
        name: '',
        idAccount: '',
        idImage: '',
    }
    + res: {
        status:'',
        data:'',
        message:''
    }

- DELETE: /baby/:id `Delete Baby`
    + req: no body
    + res: {
        status:'',
        data:'',
        message:''
    }

