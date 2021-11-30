const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const { importCsv } = require('../controllers/import-csv')

/* GET home page. */
router.post('/', upload.single('file'), async (req, res, next) => {
  const resp = await importCsv(req, res, next)
  res.status(resp.status).json(resp)
});

module.exports = router;
