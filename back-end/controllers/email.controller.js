const service = require("../services/email.services.js");
class requestHandler {
    // POST
    sendEmailNewsletter = async (req, res) => {
        const emailTo = ""
        const emailSubject = "Newsletter - Sakaue LGPD"
        const emailBody = "This week's newsletter [...]"
        try{
            let response = await service.sendEmail(emailTo, emailSubject, emailBody)
            res.status(200).send(response)
        }catch (err){
            res.status(400).send(err)
        }
    };
    sendEmailPromotional = async (req, res) => {
        const emailTo = ""
        const emailSubject = "Promotional - Sakaue LGPD"
        const emailBody = "Promotional email [...]"
        try{
            let response = await service.sendEmail(emailTo, emailSubject, emailBody)
            res.status(200).send(response)
        }catch (err){
            res.status(400).send(err)
        }
    };
}

module.exports = new requestHandler();
