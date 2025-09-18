import express from 'express';
import { createUrls, deleteUrl, getUrl, getUrls, logClick } from '../controller/urlController.js';

const router = express.Router();

router.get('/', getUrls);
router.get('/:code', getUrl);
router.post('/', createUrls);
router.post('/:code/clicks', logClick);
router.delete('/:code', deleteUrl);


export default router;