// npm install nodemailer
// mail test : https://mailtrap.io/
const nodemailer = require("nodemailer");
const email = {
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "2532b6c73df0e7",
    pass: "ef07e10ab49a56",
  },
  secure: false,
};

const send = async (option) => {
  nodemailer.createTransport(email).sendMail(option, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
      return info.response;
    }
  });
};

let email_data = {
  from: "webjeck@gmail.com",
  to: "jin.yu.vuno@gmail.com",
  subject: "테스트 메일입니다.",
  text: "nodejs 한시간만에 끝내기",
};

send(email_data);
