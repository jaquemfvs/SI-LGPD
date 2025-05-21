const emailService = require("./email.services.js");
const { User } = require("../models/index.js");
let counter = 0;
class triggerEmailService {
    triggerNewsletterEmail = async () =>{
        counter++;
        const emailSubject = `${counter} Newsletter - Sakaue LGPD`
        const emailBody = `This week's newsletter, number ${counter}`
        try{
            let subscribers = await User.findAll({where: {subscribedToNewsletter: true}})
            subscribers.forEach(async (s)=>{
                await emailService.sendEmail(s.email, emailSubject, emailBody)
            })
            return subscribers
        }catch (err){
            console.log(err)
            return null
        }
    }
     triggerPromotionalEmail = async () =>{
        counter++;
        const emailSubject = `${counter} Promotional - Sakaue LGPD`
        const emailBody = `Promotional email [...], number ${counter}`
        try{
            let subscribers = await User.findAll({where: {agreedToPromotionalEmails: true}})
            subscribers.forEach(async (s)=>{
                await emailService.sendEmail(s.email, emailSubject, emailBody)
            })
            return subscribers
        }catch (err){
            console.log(err)
            return null
        }
    }

}

module.exports = new triggerEmailService();