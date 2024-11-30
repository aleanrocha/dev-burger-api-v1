import multer from 'multer'

import { extname, resolve } from 'node:path'
import { v4 } from 'uuid'

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'uploads'),
    filename: (_, fl, cb) => {
      return cb(null, v4() + extname(fl.originalname))
    },
  }),
}
