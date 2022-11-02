const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const XLSX = require('xlsx')
const admin = require('firebase-admin')


admin.initializeApp();


exports.sendMail = functions.https.onRequest((req, res) => {

    const body=req.body;
    const email= body["email"];

    functions.logger.log(email);
    const db = admin.firestore();

    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        console.clear()
        // const data = [];
        


        const snapshot = await db.collection('Jobs').get();
   

       

    

        const convertJsontoExcel = () => {
            const workSheet = XLSX.utils.json_to_sheet(snapshot);
            const worBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(worBook, workSheet, "assesments");
            XLSX.write(worBook, {
                bookType: 'xlsx',
                type: "buffer"
            });
            XLSX.write(worBook, { bookType: "xlsx", type: "binary" });
            XLSX.writeFile(worBook, "Assesments.xlsx");
            console.log('conversion finished')


            // console.log(XLSX.write.name)

        }

        convertJsontoExcel();


        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport(

            {
                "host": "smtp-relay.sendinblue.com",
                "port": 587,
                "secure": false,
                "auth": {
                    "user": "support@digisailor.com",
                    "pass": "S2JEwyrnBMIALHhU"
                }
            }

        );

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Jeya industries" <support@digisailor.com>', // sender address
            to: 'rampowiz@gmail.com', // list of receivers
            subject: "daily report", // Subject line
            text: "report", // plain text body
            attachments: [
                {   // utf-8 string as an attachment
                    path: './Assesments.xlsx',

                },

            ]

        });

       

        return "Message sent: %s" + info.messageId;
        // console.log("Message sent: %s", info.messageId);
        // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));


        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    return main();




   








  


});
