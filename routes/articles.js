const { Router } = require('express');
const { createArticle, deleteArticle } = require('../controllers/articles');
const auth = require('../middlewars/auth');

const router = Router();

router.post('/articles', auth, createArticle);
router.delete('/articles/:articleId', auth, deleteArticle);

module.exports = router;
