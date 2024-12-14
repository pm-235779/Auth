import {VERIFICATION_EMAIL_TEMPLATE} from "./emailTemplate.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailTemplate.js";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate.js";
import { mailtrapclient } from "./mailtrap.config.js";


export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient =[{email}];
    const sender = {email:"hello@demomailtrap.com" , name: "Pukhraj Motwani"};
    try {   
    const response = await mailtrapclient.send({
        from: sender,
        to: recipient,
        subject: "Account Verification Email",
        html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationToken}", verificationToken),
        // text: `Your verification token is ${verificationToken}`,
        category: "Email Verification",
      });

      console.log("Email sent successfully:", response);
    } catch (error) {
        console.log(error);
      throw new Error("Failed to send email:", error);
    }
}

export const sendWelcomeEmail = async (email,name) => {
    const recipient =[{email}];
    const sender = {email:"hello@demomailtrap.com" , name: "Pukhraj Motwani"};

    try{
        const response = await mailtrapclient.send({
            from: sender,
            to: recipient,
        
            template_uuid:"b5b23e39-b854-4b55-8fdf-754ac4a73963",
            template_variables: {
                "name": name,
                "company_info_name": "Pukhraj Motwani",
              }
        })

        console.log(" Welcome Email sent successfully:", response);
    }
    catch(error){
        console.log(error);
        throw new Error("Failed to send email:", error);
    }
}

export const sendResetPasswordEmail = async (email, resetURL) => {
    const recipient =[{email}];
    const sender = {email:"hello@demomailtrap.com" , name: "Pukhraj Motwani"};
    try {
        const response = await mailtrapclient.send({
            from: sender,
            to: recipient,
            subject: "Reset Password Email",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        });

        console.log("Email sent successfully:", response);
      } catch (error) { 
        console.log(error); 
        throw new Error("Failed to send email:", error);
      }
}

export const  sendResetPasswordSuccessEmail = async (email) => {
    const recipient =[{email}];
    const sender = {email:"hello@demomailtrap.com" , name: "Pukhraj Motwani"};
    try {
        const response = await mailtrapclient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success",
        });
        console.log("Email sent successfully reset:", response);
      } catch (error) {
        console.log(error);
        throw new Error("Failed to send email:", error);
      }
}