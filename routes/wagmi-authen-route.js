const express = require('express');
const router = express.Router();
const { generateNonce, SiweMessage }= require('siwe');

router.get("/nonce", async (req,res) => {
    req.session.nonce = generateNonce()
    await req.session.save()
    res.setHeader('Content-Type', 'text/plain');
    res.send(req.session.nonce);
})
router.post("/verify", async (req,res) => {
    try {
        const { message, signature } = req.body
        const siweMessage = new SiweMessage(message)
        const fields = await siweMessage.validate(signature)
        if (fields.nonce !== req.session.nonce)
          return res.status(422).json({ message: 'Invalid nonce.' })
        req.session.siwe = {...fields}
        await req.session.save();
        res.json({ ok: true })
    } catch (error) {
        res.json({ ok: false })
    }
   
});
router.get("/me", async(req,res) => {
    res.send({ address: req.session.siwe?.address })
})
router.get("/logout", async(req,res) => {
    req.session.destroy()
    res.send({ ok: true })
})  

module.exports = router