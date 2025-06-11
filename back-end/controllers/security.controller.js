const backupService = require("../services/backup.services.js");
const triggerEmailService = require("../services/triggerEmailService.js");

class requestHandler {
    // POST
    backupDatabase = async (req, res) => {
        try{
            await backupService.backupDatabase();
            res.status(200).send()
        } catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    };
    notifyBreach = async (req, res) => {
        try{
            await backupService.backupDatabase();
            await triggerEmailService.triggerBreachNotificationEmail();

            res.status(200).send()
        } catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    }
    // PUT
    restoreDatabase = async (req, res) => {
        try{
            await backupService.restoreMostRecentDatabase();
            res.status(200).send()
        } catch(err){
            console.log(err)
            res.status(400).send(err)
        }    
    }
}

module.exports = new requestHandler();
