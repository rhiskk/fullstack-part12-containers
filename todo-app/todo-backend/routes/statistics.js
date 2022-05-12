const express = require('express');
const router = express.Router();
const { getAsync, setAsync } = require('../redis')

router.get('/', async(_, res) => {
    const count = await getAsync('count')
    res.send({ added_todos: Number(count ? count : 0) })
})

module.exports = router;