const triggerEmailService = require("../services/triggerEmailService.js");
class requestHandler {
    // POST
    sendEmailNewsletter = async (req, res) => {
        try{
            await triggerEmailService.triggerNewsletterEmail();
            res.status(200).send()
        } catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    };
    sendEmailPromotional = async (req, res) => {
        try{
            await triggerEmailService.triggerPromotionalEmail();
            res.status(200).send()
        } catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    };
}

module.exports = new requestHandler();
