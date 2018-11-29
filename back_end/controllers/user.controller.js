const usersModel = require('../models/user');
const savesModel = require('../models/save');
const bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');


function Register(req, res) {

    var userCreate = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        state: req.body.state,
        address: req.body.address,
        email: req.body.email.toLowerCase(),
        phoneNumber: req.body.phoneNumber,
        password: bcrypt.hashSync(req.body.password)
    };

    usersModel.findOne({
        email: userCreate.email
    }, (err, user) => {
        if (user) return res.json({
            status: false,
            message: "Email exists, Please use another Email"
        });

        usersModel.findOne({
            phoneNumber: userCreate.phoneNumber
        }, (err, user) => {
            if (user) return res.json({
                status: false,
                message: "Phone Number already exists, please use another phone number"
            });

            (new usersModel(userCreate)).save((err, user) => {

                if (err) return res.json({
                    'status': false,
                    'message': "Error in creating user",
                });

                res.status(201).json({
                    status: true,
                    message: 'Successfully Registered, Please check your mail to activate your account'
                });
                Email(userCreate.email);
            });
        });

    });
}

function Email(data) {

    usersModel.findOne({
        'email': data
    }, 'first_name last_name id phoneNumber email', function (err, user) {
        if (err) return res.status(422).json({
            status: false,
            message: "an error occured",
            payload: null
        });

        let signature = user;
        delete user.first_name;
        delete user.last_name;

        jwt.sign({
            user
        }, 'secretkey', {
            expiresIn: 60 * 60 * 60 * 2
        }, (err, token) => {
            if (err) return res.status(422).json({
                status: false,
                message: "an error occured",
                payload: null
            })

            const output = `
            <p>Welcome to Savers App</p>
            <h3>Contact Details</h3>
            <ul>  
            <li>Name: ${signature.first_name}  ${signature.last_name}</li>
            <li>PhoneNumber: ${signature.phoneNumber}</li>
            </ul>
            <h3>Click the link below to activate your account. Note: The Link expires in 2 days</h3>
            <a href = http://localhost:3000/users/activate/${token}>Activate</a>
        `;
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {
                    user: 'amaugosomto@gmail.com',
                    pass: 'nokia130'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            let HelperOptions = {
                from: '"AmaugoSomto" <amaugosomto@gmail.com>',
                to: data,
                subject: 'Activation',
                html: output
            };

            transporter.sendMail(HelperOptions, (error, info) => {
                if (error) {
                    return
                }
                console.log("The message was sent!");
                console.log(info);
            });
        });
    });
}

function Update(req, res) {
    usersModel.findById(req.body.user, (err, user) => {
        if (err) return res.json({
            status: false,
            message: 'An Error Occured'
        });
        if (!user) return res.status(404).json({
            status: false,
            message: 'User Not found'
        });

        if (req.body.state) {
            user.permission = req.body.state;

            user.save((err) => {
                if (err) return res.json({
                    status: false,
                    message: 'An Error occured, Please try again'
                });
                return res.json({
                    status: true,
                    message: 'Permission Updated Succesfully'
                });
            })
        } else {
            bankCodes = {
                Access: '044',
                Sterling: '232',
            }

            user.account_number = req.body.account_number;
            user.bank_name = req.body.bank_name;
            user.account_bank = req.body.account_bank;
            user.account_name = req.body.account_name;

            user.save((err) => {
                if (err) return res.json({
                    status: false,
                    message: 'An Error Occured'
                });
                res.status(200).json({
                    status: true,
                    message: 'Successfully updated'
                });
            });
        }

    });
}

function Activate(req, res) {
    var userToken = req.params.token;
    var id = "";


    jwt.verify(userToken, 'secretkey', (err, authData) => {
        if (err) return res.status(403).json({
            status: false,
            message: "False Token",
            payload: null
        });

        usersModel.findById(authData.user._id, (err, activate) => {
            if (err) return res.json({
                'status': false,
                'message': 'An Error Occured',
                payload: null
            });

            if (!activate) return res.json({
                status: false,
                message: 'Contact administrator, token error'
            });

            if (activate.activated) return res.send(`
                <p>You have already been activated!, if you are not redirected click below </p>
                <a href=http://127.0.0.1:5500/index.html#/login>Click Here</a>
            `);

            activate.activated = true;
            activate.save((err, saved) => {
                if (err) return res.status(422).json({
                    'status': false,
                    'message': 'An Error Occured',
                    payload: null
                });
                res.status(202).send(`
                <p>You have been activated!, If you are not redirected click below </p>
                <a href=http://127.0.0.1:5500/index.html#/login>Click Here</a>`);
            });
        });
    });
}

function Login(req, res) {

    usersModel.findOne({
        email: req.body.email
    }, (error, user) => {
        if (error) return res.json({
            'status': false,
            'message': 'An Error Occured'
        });
        if (!user) return res.json({
            'status': false,
            'message': 'User Doesn\'t exit, please REGISTER'
        });

        if (!user.activated) return res.json({
            'status': false,
            'message': 'Please go to your email and activate your account before proceding'
        });

        if (bcrypt.compareSync(req.body.password, user.password) == false) {
            return res.json({
                'status': false,
                'message': 'Incorrect login credentials, please try again.',
                payload: null
            })
        }

        user.password = '';

        var token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
            expiresIn: 60 * 60
        });

        var payload = {};
        payload.token = token;
        payload.user_details = user;
        res.status(200).json({
            'status': true,
            'message': 'Successfully Logged in',
            payload: payload
        });
    });
}

function view(req, res) {
    let id = req.params.id

    if (id) {
        usersModel.findById(id, (err, user) => {
            if (err) return res.json({
                status: false,
                message: 'An Error occured'
            });
            if (!user) return res.json({
                status: false,
                message: 'User does not exist...'
            });

            user.password = '';
            res.status(200).json({
                status: true,
                message: 'User Fetched Succesfully',
                payload: user
            });
        });
    } else {
        usersModel.find({}, (err, users) => {
            if (err) return res.json({
                status: false,
                message: 'An error occured'
            });
            if (!users) return res.json({
                status: false,
                message: 'Could not retrieve any user'
            });

            users.password = '';
            res.status(200).json({
                status: true,
                message: 'Users Gotten',
                payload: users
            });
        });
    }

}

function countNumbers(req, res) {
    payload = {};

    usersModel.collection.stats(function (err, result) {
        if (err) return res.json({
            status: false,
            message: 'An error occured'
        });
        payload.userCount = result.count;
        payload.userWeight = result.storageSize;

        savesModel.find({}, (err, result) => {
            if (err) return res.json({
                status: false,
                message: 'An error occured'
            });
            var element = {
                amount: 0
            }
            for (let index = 0; index < result.length; index++) {
                element.amount += result[index].amountPaidTillDate;
            }
            payload.element = element

            savesModel.collection.stats(function (err, result) {
                if (err) return res.json({
                    status: false,
                    message: 'An error occured'
                });
                payload.saveCount = result.count;
                payload.saveWeight = result.storageSize;

                return res.json({
                    status: true,
                    payload
                });
            });
        });

    });
}

function htmlViews(req, res) {

    if (req.params.key === "login") {
        return res.render('login.html');
    } else if (req.params.key === "register") {
        return res.render('register.html');
    } else if (req.params.key === "index") {
        return res.render('index.html');
    }
}

function upload_photo(req, res) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '../../Project/assets/img/uploads/')
        },
        filename: function (req, file, cb) {
            if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
                var err = new Error();
                err.code = 'filetype';
                return cb(err);
            } else {
                cb(null, Date.now() + '_' + file.originalname);
            };
        }
    });

    var upload = multer({
        storage: storage,
        limits: {
            fileSize: 10000000
        }
    }).single('myFile');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.json({
                status: false,
                message: 'An error occured in multer'
            });
        } else if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.json({
                    success: false,
                    message: 'File size is too large, limit is 10MB'
                });
            } else if (err.code === 'filetype') {
                res.json({
                    success: false,
                    message: 'File type is invalid, must be picture'
                });
            } else {
                res.json({
                    success: false,
                    message: 'File was not able to be uploaded'
                });
            };
        } else {
            if (!req.file) {
                res.json({
                    status: false,
                    message: 'No file was selected'
                });
            } else {

                let token = req.headers['x-access-token'];

                jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
                    if (err) return res.json({
                        status: false,
                        message: "False Token"
                    });
                    usersModel.findById(authData._id, (err, user) => {
                        if (err) return res.json({
                            status: false,
                            message: 'An Error Occured'
                        });

                        if (user.img_name) {
                            let old_img_src = `../../Project/assets/img/uploads/${user.img_name}`;
                            fs.unlink(old_img_src, (err) => {
                                if (err) console.log('An error occured');
                                console.log('Successfully Deleted old image');
                            });
                        }

                        user.img_name = req.file.filename;
                        user.save((err) => {
                            if (err) {
                                console.log(err);
                                return res.json({
                                    status: false,
                                    message: 'An Error Occured',
                                    payload: err
                                });
                            }
                            console.log('user')
                            return res.json({
                                status: true,
                                message: 'File has been uploaded'
                            });
                        })
                    })
                })
            }
        }

        // Everything went fine.
    })
}

function request_change(req, res) {
    let user_email = req.params.email;

    console.log(user_email)
    usersModel.findOne({
        'email': user_email
    }, (error, user) => {
        if (error) return res.json({
            'status': false,
            'message': 'An Error Occured'
        });

        if (!user) return res.json({
            'status': false,
            'message': 'Email Doesn\'t exit, please REGISTER'
        });

        jwt.sign({
            user_email
        }, 'secret_email_key', {
            expiresIn: 60 * 60 * 2
        }, (err, token) => {
            if (err) return res.json({
                status: false,
                message: 'An error occurred please contact admin'
            });

            reset_email(user_email, token);
            res.json({
                status: true,
                message: 'Please check your mail for a reset link'
            });
        });
    });
}

function reset_email(email, token) {
    const output = `
            <p>Reset your Password</p>
            <h3>You requested for a change of password, please click below to reset your password, if you did not please disregard this mail</h3>
            <hr>
            <h3>Click the link below to reset your password. Note: The Link expires in 2 hours</h3>
            <a href = http://localhost:3000/users/reset/${token}>Reset</a>
        `;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
            user: 'amaugosomto@gmail.com',
            pass: 'nokia130'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let HelperOptions = {
        from: '"AmaugoSomto" <amaugosomto@gmail.com>',
        to: email,
        subject: 'Password Reset',
        html: output
    };

    transporter.sendMail(HelperOptions, (error, info) => {
        if (error) {
            return
        }
        console.log("The message was sent!");
        console.log(info);
    });
}

function reset_pass_bypass(req, res) {
    var token = req.params.token;

    jwt.verify(token, 'secret_email_key', (err, data) => {
        if (err) return res.status(403).json({
            status: false,
            message: "False Token or token has expired",
            payload: null
        });

        usersModel.findOne({
            'email': data.user_email
        }, (err, user) => {
            if (err) return res.json({
                'status': false,
                'message': 'An Error Occured',
                payload: null
            });

            if (!user) return res.json({
                status: false,
                message: 'User not found, contact Admin'
            });

            res.status(202).send(`
                <p>Your password reset request has been accepted, click below if not redirected </p>
                <a href=http://127.0.0.1:5500/index.html#/reset/${token}>Click Here</a>`);
        });
    });

}

function reset_password(req, res) {
    var token = req.params.token;

    jwt.verify(token, 'secret_email_key', (err, data) => {
        if (err) return res.status(403).json({
            status: false,
            message: "False Token or token has expired",
            payload: null
        });

        usersModel.findOne({
            'email': data.user_email
        }, 'password', (err, user) => {
            if (err) return res.json({
                'status': false,
                'message': 'An Error Occured',
                payload: null
            });

            if (!user) return res.json({
                status: false,
                message: 'User not found, contact Admin'
            });

            if (bcrypt.compareSync(req.body.password, user.password) == true) {
                return res.json({
                    'status': false,
                    'message': 'Old password matches new one, please change password',
                    payload: null
                });
            }

            user.password = bcrypt.hashSync(req.body.password);

            user.save((err) => {
                if (err) return res.json({
                    status: false,
                    message: 'An Error Occured'
                });
                res.status(200).json({
                    status: true,
                    message: 'Successfully updated Password'
                });
            });
        });
    });

}

module.exports = {
    Register,
    Activate,
    Login,
    view,
    Update,
    countNumbers,
    htmlViews,
    upload_photo,
    request_change,
    reset_pass_bypass,
    reset_password
}