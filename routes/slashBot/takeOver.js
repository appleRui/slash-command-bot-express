require('dotenv/config')

const express = require('express');
const slack = require('../../modules/slack')
const takeOverView = require('../../views/modals/takeOver')

const router = express.Router();
const channel = process.env.NOTIFICATION_CHANNEL

/* GET users listing. */
router.post('/modal-open', async function(req, res, next) {
    const {
        trigger_id
    } = req.body
    const view = takeOverView
    const params = {
        trigger_id,
        view,
    }
    try {
        await slack.views.open(params)
    } catch (e) {
        console.error(e)
    }
    res.status(200).send(null)
});

router.post('/send', async (req, res, next) => {
    const {
        view
    } = JSON.parse(req.body.payload)

    const values = view.state.values;
    const ttl = values.ttl['plain_text_input-action'].value
    const subject = values.subject['static_select-action'].selected_option.text.text
    const detail = values.detail['plain_text_input-action'].value
    const improvement = values.improvement['plain_text_input-action'].value
    const text = `【生徒様名】\n${ttl}\n\n【教材内容】\n${subject}\n\n【詳細】\n${detail}\n\n【改善方法】\n${improvement}`

    const params = {
        text,
        channel
    }

    try {
        await slack.chat.postMessage(params)
    } catch (e) {
        console.error(e)
    }
    res.status(200).send(null)
})

module.exports = router;
