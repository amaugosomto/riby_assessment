var saveModel = require('../models/save');
var userModel = require('../models/user');
const paymentModel = require('../models/payment.model');
var moment = require('moment');

function requestSave(req, res) {

    var formVal = {
        userId: req.body.userId,
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        duration: req.body.duration,
        amount: req.body.amount,
        option: req.body.option,
        interest: req.body.minInterest
    };

    if (formVal.option == 'jumbo' || formVal.option == 'premium' || formVal.option == 'personal' || formVal.option == 'family') {
        formVal.plan = 'continuous';
    } else {
        formVal.plan = 'fixed';
    }

    if ( req.body.txRef && formVal.plan == 'continuous' ) {
        formVal.paid = true
        formVal.txRef = req.body.txRef;
    } else {
        formVal.paid = false;
    }

    // if (formVal.plan == 'continuous') formVal.amountToPayMonthly = Math.round(formVal.amount / formVal.duration);

    var current = new Date();
    var hour = current.getHours() + 1;

    var startDate = new Date();
    let endDate = new Date();
    startDate.setHours(hour + 1);
    endDate.setHours(hour + 1);

    formVal.saveDate = startDate;
    endDate.setMonth(formVal.duration + endDate.getMonth());
    formVal.durationElapse = endDate;

    /**
     *  Check Duration, increase interest by 1 if Duration is more than a year of minimum duration
     *  increase interest by 2 if duration is more than maximum duration
     *  These interest rates apply only at the start of the year after the minimum duration
     *  or the start of the second year after the minimum duration
     *  Same logic goes for fixed and continuous savings
     */

    let minDateForm = req.body.minDate;
    let minDate = moment();
    let extra = moment();
    let month = minDate.month();
    minDate.month(minDateForm + month);
    extra.month(formVal.duration + month);
    let diff = extra.diff(minDate, 'month');

    if (diff > 11 && diff < 24) {
        formVal.interest += 1;
    } else if (diff > 23) {
        formVal.interest += 2;
    }

    var percentage = roundNumber(formVal.interest / 100);
    var projectedInterest = formVal.amount * percentage;
    var projectedAmount = parseInt(projectedInterest) + parseInt(formVal.amount);

    /**
     *  For savings above 3 years: every year after this, give equivalent of interest yearly
     */

     formVal.projectedAmount = 0;
    if (formVal.duration > 24){
        
        let today = new Date();
        today.setHours(hour + 1);
        today.setMonth(today.getMonth() + 24);
        let second_year = today;
        let duration_after_3rd = extra.diff(second_year, 'days');
        let daily_amount = (percentage * formVal.amount ) / 365;
        var extra_amount = daily_amount * duration_after_3rd;
        formVal.projectedAmount += extra_amount
        // console.log(daily_amount, extra_amount, duration_after_3rd, percentage)
    }

    formVal.projectedInterest = parseInt(projectedInterest);

    formVal.projectedAmount += projectedAmount;

    const save = new saveModel(formVal);
    save.save().then((response) => {
        res.status(201).json({
            'status': true,
            'message': 'You have Successfully created a Saving Plan'
        });
    }, (error) => {
        res.status(422).json({
            'status': false,
            'message': 'An Error Occured'
        });
    });
}

function payment(req, res) {

    var amount = parseInt(req.body.amount);
    var id = req.body.id;
    var txref = req.body.txref;

    saveModel.findById(id, (err, deposit) => {
        if (err) return res.status(422).json({
            status: false,
            message: 'An Error Occured',
            payload: null
        });

        // check if continuous loan has been paid up
        if (deposit.paidComplete && deposit.plan == 'continuous') {
            return res.json({
                status: false,
                message: 'Your save plan has been completed, please create a new plan'
            });
        }

        var newAmount = deposit.amountPaidTillDate + amount;
        if (newAmount > deposit.amount) {
            var supAmount = deposit.amount - deposit.amountPaidTillDate;
            return res.json({
                status: false,
                message: `You only have to pay ${supAmount}, please adjust your payment`
            });
        }

        // check to make sure user pays the monthly contributions correctly
        // if (deposit.plan == 'continuous' && !txref) {
        //     if (amount != deposit.amountToPayMonthly) {
        //         return res.json({
        //             status: false,
        //             message: `Please adjust your payment, please pay ${deposit.amountToPayMonthly}`
        //         });
        //     }
        // }

        // check if fixed loan has been paid completely
        if (deposit.paid && deposit.plan == 'fixed') {
            return res.json({
                status: false,
                message: 'You have fully paid, Please create a new plan'
            });
        }

        // ckeck to make sure user pays the fixed loan amount once;
        if (deposit.plan == 'fixed' && !txref) {
            if (amount != deposit.amount) {
                return res.json({
                    status: false,
                    message: `Please adjust your payment, please pay ${deposit.amount}`
                });
            } else {
                deposit.paid = true;
            }
        }
        deposit.txref = txref;

        if (deposit.amountPaidTillDate == 0) {
            deposit.fstPaymentDate = new Date();
            deposit.payCount++
        } else if (deposit.payCount) {
            deposit.payCount++
        }

        deposit.amountPaidTillDate += amount;
        let depAmount = deposit.amountPaidTillDate;
        let strAmount = deposit.amount

        // calculate the remainder of the monthly contributions
        // if (deposit.plan == 'continuous') {
        //     if ((deposit.amount - deposit.amountPaidTillDate) < deposit.amountToPayMonthly) {
        //         deposit.amountToPayMonthly = deposit.amount - deposit.amountPaidTillDate;
        //     }
        // }

        // set month after wpayment is complete (up for revision)
        if (depAmount == strAmount) {

            let dueDate = new Date();
            let hour = dueDate.getMonth();
            dueDate.setMonth(hour + parseInt(deposit.duration));
            deposit.durationElapse = dueDate;

            deposit.paidComplete = true;
        }

        // calculates the date of next payment for continuous savings only.
        if (deposit.plan != 'fixed'){
            deposit.next_payment = moment().add(1, 'months');
        };

        deposit.save((err, saved) => {
            if (err) return res.status(422).json({
                status: false,
                message: 'An error has occured',
                payload: null
            });
            const paymentDetails = {
                amount: req.body.amount,
                savingId: saved._id,
                plan: deposit.plan,
                option: deposit.option
            };
            const payment = new paymentModel(paymentDetails);
            payment.save();
            res.status(200).json({
                status: true,
                message: 'You have successfully deposited into your savings',
                payload: saved
            });
        });
    });
}

function withdrawal(req, res) {
    var id = req.body.id;

    try {
        saveModel.findById(id, (err, withdraw) => {
            if (err) return res.json({
                status: false,
                message: 'An error has occured',
                payload: null
            });

            if (!withdraw) return res.json({
                status: false,
                message: 'Saving not found. Contact Admin'
            });

            if (withdraw.disbursed) {
                return res.json({
                    status: true,
                    message: 'Your save plan has been disbursed, please create a new plan'
                });
            }

            if (withdraw.amountPaidTillDate < 1) {
                return res.json({
                    status: false,
                    message: 'No money has been paid, please pay.'
                })
            }

            userModel.findById(req.body.userId, (err, user) => {
                if (err) return res.json({
                    status: false,
                    message: 'An error occured, please try again'
                });

                if (!user) return res.json({
                    status: false,
                    message: 'User not found. Contact Admin'
                });

                var early = req.body.early;

                // Calculating the amount he has accumulated (Countinuous saving);
                if (!withdraw.disbursed) {
                    var save = withdraw;

                    if (save.payCount) {
                        var newDate = moment(save.fstPaymentDate)
                    } else {
                        var newDate = moment(save.saveDate);
                    }

                    if (save.amountPaidTillDate >= 1) {
                        let amount = save.amountPaidTillDate * (save.interest / 100);
                        let duration = moment(save.durationElapse);
                        let saveDate = newDate;
                        let today = moment();
                        let saveDiff = duration.diff(saveDate, 'days');
                        let todayDiff = today.diff(newDate, 'days');
                        let dayAmount = amount / saveDiff;
                        save.todayAmount = roundNumber((dayAmount * todayDiff));
                    }
                }


                // calculate penalty if user withdraws early
                /**
                     * Take 3% of the amount saved if its before the mid month to the withdrawable month for fixed savings.
                     * Take all the interest and pay just the amount saved if user defualts for fixed savings(exceeds mid month).
                 * 
                 *--------------------------------------------

                 * Take 80% of interest accumulated if its before the mid month of the withdrawable month for recurrent savings.
                 * Take 30% of interest accumulated if its after the mid month of the withdrawable month for recurrent savings.
                 */
                if (!early) {
                    if (withdraw.plan == 'fixed') {
                        let startDate = moment(withdraw.saveDate);
                        let endDate = moment(withdraw.durationElapse);
                        let today = moment();
                        let todayDiff = Math.round(today.diff(startDate, 'month'));
                        let midMonth = Math.round(endDate.diff(startDate, 'month') / 2);

                        if (todayDiff < midMonth) {
                            amountToPay = roundNumber(withdraw.amount - (withdraw.amount * (3 / 100)));
                        } else {
                            amountToPay = withdraw.amount;
                        }

                    } else {
                        let startDate = moment(withdraw.saveDate);
                        let endDate = moment(withdraw.durationElapse);
                        let today = moment();
                        let todayDiff = Math.round(today.diff(startDate, 'month'));
                        let midMonth = Math.round(endDate.diff(startDate, 'month') / 2);
                        let amountToday = save.todayAmount;

                        if (todayDiff < midMonth) {
                            let amount = roundNumber(amountToday - (amountToday * (80 / 100)));
                            amountToPay = withdraw.amountPaidTillDate + amount;
                        } else {
                            let interest = roundNumber(amountToday - (amountToday * (30 / 100)));
                            amountToPay = withdraw.amountPaidTillDate + interest;
                        }
                    }
                } else {
                    amountToPay = save.todayAmount;
                }

                withdraw.complete = true;
                withdraw.disbursed = true;
                withdraw.amountDisbursed = amountToPay;
                withdraw.accountPaidTo = user.account_number;
                withdraw.save((err, saved) => {
                    if (err) return res.json({
                        status: false,
                        message: 'Unsuccesful Withdrawal'
                    });
                    res.status(201).json({
                        status: true,
                        message: `${amountToPay} has been succesfully paid to ${user.account_name}, ${user.account_number} of ${user.bank_name}`
                    });
                });
            });
        });

    } catch (error) {
        res.json({
            status: false,
            message: error.message
        });
    }
}

function ViewSaves(req, res) {
    let id = req.params.id;

    if (id) {
        saveModel.find({
            userId: id
        }, (error, payload) => {
            if (error) return res.status(422).json({
                'status': false,
                'message': 'An Error Occured'
            });


            // Calculating Amount gained till date for each savings
            for (let index = 0; index < payload.length; index++) {
                var save = payload[index];

                // Because some have already started paying before this logic
                if (save.payCount) {
                    var newDate = moment(save.fstPaymentDate)
                } else {
                    var newDate = moment(save.saveDate);
                }

                // Implement next line when the system is cleared and starting afresh
                // change newDate from the next block to be saveDate = moment(save.fstPaymentDate);


                if (save.amountPaidTillDate > 1) {
                    if (!save.disbursed) {
                        let amount = save.amountPaidTillDate * (save.interest / 100);
                        let duration = moment(save.durationElapse);
                        let saveDate = newDate;
                        let today = moment();
                        let saveDiff = duration.diff(saveDate, 'days');
                        let todayDiff = today.diff(newDate, 'days');
                        let dayAmount = amount / saveDiff;
                        save.todayAmount = roundNumber(save.amountPaidTillDate + parseFloat((dayAmount * todayDiff)));
                        payload[index].todayAmount = save.todayAmount;
                    } else {
                        payload[index].todayAmount = save.amountDisbursed;
                    }
                } else {
                    payload[index].todayAmount = save.amountPaidTillDate;
                }

            }

            res.status(200).json({
                'status': true,
                'message': 'Saves Gotten',
                payload: payload
            });

        });
    } else {
        saveModel.find({}, (err, savings) => {
            if (err) return res.status(422).json({
                status: false,
                message: 'An error occurred'
            });

            if (!savings) return res.status(404).json({
                status: false,
                message: 'No Savings found'
            });

            res.status(200).json({
                status: true,
                message: 'Savings Gotten',
                payload: savings
            });
        });
    }
}

function viewSave(req, res) {
    let id = req.params.id;
    paymentModel.find({
        savingId: id
    }, (err, payload) => {
        if (err) return res.json({
            status: false,
            message: 'An Error Occurred'
        });
        if (!payload) return res.json({
            status: false,
            message: 'Save not Found'
        });

        res.status(200).json({
            status: true,
            message: 'Save History Gotten',
            payload
        });
    });
}

function roundNumber(num, scale = 2) {
    if (!("" + num).includes("e")) {
        return +(Math.round(num + "e+" + scale) + "e-" + scale);
    } else {
        var arr = ("" + num).split("e");
        var sig = ""
        if (+arr[1] + scale > 0) {
            sig = "+";
        }
        var i = +arr[0] + "e" + sig + (+arr[1] + scale);
        var j = Math.round(i);
        var k = +(j + "e-" + scale);
        return k;
    }
}

module.exports = {
    requestSave,
    withdrawal,
    payment,
    ViewSaves,
    viewSave
}