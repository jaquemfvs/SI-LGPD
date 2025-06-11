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
    triggerBreachNotificationEmail = async () =>{
        let now = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format((new Date()));
        const emailSubject = `Security Notice: Possible Data Breach (${now})`
        const emailBody = "We recently detected unauthorized access to our systems, and your account information may have been affected.\n"
                        + "As a precaution, we recommend changing your password and staying alert for suspicious emails.\n"
                        + "We apologize for the inconvenience and are working to enhance our security."
        try {
            let users = await User.findAll()
            users.forEach(async (s)=>{
                await emailService.sendEmail(s.email, emailSubject, emailBody)
            })
            return users
        } catch (err) {
            console.log(err)
            return null
        }
    }
}

module.exports = new triggerEmailService();