const db = require("../db")
const debugCsv = require('debug')('transaction-demo-mysql:importCsv');
const fs = require('fs')
const path = require('path')
const csvParser = require('csv-parser')
const { responseError, responseSuccess } = require('../config/response.config')

const demoModel = db.demo
const sequelize = db.sequelize

const importCsv = async (req, res, next) => {
  const csvFilePath = req.file && req.file.path ? path.resolve('./', req.file.path) : null
  try {
    debugCsv(`Starting import of csv data`)
    if (!csvFilePath) {
      return responseError(null, `Invalid csv file path`, 400)
    }
    const importResult = await __importCsvInner(csvFilePath)
    return importResult
  } catch(e) {
    debugCsv(`Error in importCsv func -> ${e && e.message ? e.message : '---'}`)
    return responseError(null, e && e.message ? e.message : 'Error in importCsv')
  } finally {
    if (csvFilePath && fs.existsSync(csvFilePath)) {
      fs.unlinkSync(csvFilePath)
    }
  }
}

const __importCsvInner = async (filePath) => {
  return new Promise(async (resolve, reject) => {
    const transaction = await sequelize.transaction();
    try {
      let totalCount = 0
      const csvReadStream = fs.createReadStream(filePath, {
        emitClose: false
      })
      .on('data', async (data) => {
        if (!data.SR || !data.PKNAME || !data.PKID) {
          debugCsv(`Should rollback`)
          csvReadStream.destroy(new Error(`Invalid data fields`))
          return
        }
        await demoModel.create({
          serial: parseInt(data.SR),
          name: data.PKNAME,
          description: data.PKDESC,
          demoId: parseInt(data.PKID)
        }, {
          transaction,
        })
        totalCount++
      })
      .on('end', async () => {
        await transaction.commit()
        return resolve(responseSuccess({
          totalCount,
        }, 'All data parsed'))
      })
      .on('error', async (e) => {
        debugCsv(`In error event ${e && e.message ? e.message : 'Invalid data, rollback done'}`)
        await transaction.rollback()
        return reject(responseError(null, e && e.message ? e.message : 'Invalid data, rollback done'))
      })
      
      csvReadStream.pipe(csvParser())
      
    } catch(e) {
      debugCsv(`Error in __importCsvInner func -> ${e && e.message ? e.message : '---'}`)
      await transaction.rollback()
      return reject(responseError(null, e && e.message ? e.message : 'Invalid data, rollback done'))
    }
  })
}

module.exports = {
  importCsv,
}