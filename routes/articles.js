const { Router } = require('express');
const { createArticle, deleteArticle } = require('../controllers/articles');

const router = Router();

router.post('/articles', createArticle);
router.delete('/articles/:articleId', deleteArticle);

module.exports = router;
