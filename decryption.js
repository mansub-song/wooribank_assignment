const crypto = require('crypto')

const ENCRYPTION_KEY =
    process.env.ENCRYPTION_KEY || 'abcdefghijklmnop'.repeat(2) // Must be 256 bits (32 characters)

function decrypt(text) {
    if (text == "") {
        console.log("error: empty text")
        return
    }
    const textParts = text.split(':')
    const iv = Buffer.from(textParts.shift(), 'hex')
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(ENCRYPTION_KEY),
        iv,
    )
    const decrypted = decipher.update(encryptedText)

    return Buffer.concat([decrypted, decipher.final()]).toString()
}





module.exports = {
    decrypt
}