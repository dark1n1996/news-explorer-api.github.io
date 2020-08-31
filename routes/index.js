const { Router } = require('express');

const router = Router();
const user = require('./users');
const article = require('./articles');
const pageNotExist = require('./page-not-exist');

router.use(user);
router.use(article);
router.use(pageNotExist);

module.exports = router;
