

import nodemailer from  'nodemailer';



const transporter = nodemailer.createTransport({
    secure : true , 
    host :'smtp.gmail.com',
    post:465,
    auth:{
        user:'akramzaabi7@gmail.com',
        pass:'thugvmcpskjfmxtj'
    },
    from:'akramzaabi7@gmail.com',
})
export function sendMail  (to,sub,msg)
{
    
    transporter.sendMail({
        from :'akramzaabi7@gmail.com', 
        to:to,
        subject:sub,
        html:msg
    })
    
}