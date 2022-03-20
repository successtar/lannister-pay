const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app/app");
const should = chai.should();
const fs = require("fs");



after(done => {
    // Clear Fees when done
    fs.writeFileSync("./fees.json", "{}");
    done();   
});


chai.use(chaiHttp);

describe("LANNISTER API", _ => {

    it("Add New Fee Spec", done => {
        chai.request(server)
            .post("/fees")
            .set("Content-Type", "application/json")
            .send({
                "FeeConfigurationSpec": "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"
            })
            .end((_, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.status.should.be.eql('ok');
                done()
            })
    });

    it("Example Fee Computation I", done => {
        chai.request(server)
            .post("/compute-transaction-fee")
            .set("Content-Type", "application/json")
            .send({
                "ID": 91203,
                "Amount": 5000,
                "Currency": "NGN",
                "CurrencyCountry": "NG",
                "Customer": {
                    "ID": 2211232,
                    "EmailAddress": "anonimized29900@anon.io",
                    "FullName": "Abel Eden",
                    "BearsFee": true
                },
                "PaymentEntity": {
                    "ID": 2203454,
                    "Issuer": "GTBANK",
                    "Brand": "MASTERCARD",
                    "Number": "530191******2903",
                    "SixID": 530191,
                    "Type": "CREDIT-CARD",
                    "Country": "NG"
                }
            })
            .end((_, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.AppliedFeeID.should.be.eql('LNPY1223');
                res.body.AppliedFeeValue.should.be.eql(120);
                res.body.ChargeAmount.should.be.eql(5120);
                res.body.SettlementAmount.should.be.eql(5000);
                done()
            })
    });

    it("Example Fee Computation II", done => {
        chai.request(server)
            .post("/compute-transaction-fee")
            .set("Content-Type", "application/json")
            .send({
                "ID": 91204,
                "Amount": 3500,
                "Currency": "NGN",
                "CurrencyCountry": "NG",
                "Customer": {
                    "ID": 4211232,
                    "EmailAddress": "anonimized292200@anon.io",
                    "FullName": "Wenthorth Scoffield",
                    "BearsFee": false
                },
                "PaymentEntity": {
                    "ID": 2203454,
                    "Issuer": "AIRTEL",
                    "Brand": "",
                    "Number": "080234******2903",
                    "SixID": 080234,
                    "Type": "USSD",
                    "Country": "NG"
                }
            })
            .end((_, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.AppliedFeeID.should.be.eql('LNPY1221');
                res.body.AppliedFeeValue.should.be.eql(49);
                res.body.ChargeAmount.should.be.eql(3500);
                res.body.SettlementAmount.should.be.eql(3451);
                done()
            })
    });

    it("Example Fee Computation III", done => {
        chai.request(server)
            .post("/compute-transaction-fee")
            .set("Content-Type", "application/json")
            .send({
                "ID": 91204,
                "Amount": 3500,
                "Currency": "USD",
                "CurrencyCountry": "US",
                "Customer": {
                    "ID": 4211232,
                    "EmailAddress": "anonimized292200@anon.io",
                    "FullName": "Wenthorth Scoffield",
                    "BearsFee": false
                },
                "PaymentEntity": {
                    "ID": 2203454,
                    "Issuer": "WINTERFELLWALLETS",
                    "Brand": "",
                    "Number": "AX0923******0293",
                    "SixID": "AX0923",
                    "Type": "WALLET-ID",
                    "Country": "NG"
                }
            })
            .end((_, res)=>{
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.Error.should.be.eql('No fee configuration for USD transactions.');
                done()
            })
    });


    it("More Fee Computation I", done => {
        chai.request(server)
            .post("/compute-transaction-fee")
            .set("Content-Type", "application/json")
            .send({
                "ID": 91204,
                "Amount": 4000,
                "Currency": "NGN",
                "CurrencyCountry": "NG",
                "Customer": {
                    "ID": 4211232,
                    "EmailAddress": "anonimized292200@anon.io",
                    "FullName": "Wenthorth Scoffield",
                    "BearsFee": false
                },
                "PaymentEntity": {
                    "ID": 2203454,
                    "Issuer": "MTN",
                    "Brand": "",
                    "Number": "080234******2903",
                    "SixID": 080234,
                    "Type": "USSD",
                    "Country": "NG"
                }
            })
            .end((_, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.AppliedFeeID.should.be.eql('LNPY1225');
                res.body.AppliedFeeValue.should.be.eql(22);
                res.body.ChargeAmount.should.be.eql(4000);
                res.body.SettlementAmount.should.be.eql(3978);
                done()
            })
    });

    it("More Fee Computation II", done => {
        chai.request(server)
            .post("/compute-transaction-fee")
            .set("Content-Type", "application/json")
            .send({
                "ID": 91203,
                "Amount": 5000,
                "Currency": "NGN",
                "CurrencyCountry": "NG",
                "Customer": {
                    "ID": 2211232,
                    "EmailAddress": "anonimized29900@anon.io",
                    "FullName": "Abel Eden",
                    "BearsFee": true
                },
                "PaymentEntity": {
                    "ID": 2203454,
                    "Issuer": "GTBANK",
                    "Brand": "VISA",
                    "Number": "530191******2903",
                    "SixID": 530191,
                    "Type": "CREDIT-CARD",
                    "Country": "US"
                }
            })
            .end((_, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.AppliedFeeID.should.be.eql('LNPY1222');
                res.body.AppliedFeeValue.should.be.eql(250);
                res.body.ChargeAmount.should.be.eql(5250);
                res.body.SettlementAmount.should.be.eql(5000);
                done()
            })
    });

    it("More Fee Computation III", done => {
        chai.request(server)
            .post("/compute-transaction-fee")
            .set("Content-Type", "application/json")
            .send({
                "ID": 91203,
                "Amount": 8000,
                "Currency": "NGN",
                "CurrencyCountry": "NG",
                "Customer": {
                    "ID": 2211232,
                    "EmailAddress": "anonimized29900@anon.io",
                    "FullName": "Abel Eden",
                    "BearsFee": false
                },
                "PaymentEntity": {
                    "ID": 2203454,
                    "Issuer": "GTBANK",
                    "Brand": "VISA",
                    "Number": "530191******2903",
                    "SixID": 530191,
                    "Type": "BANK-ACCOUNT",
                    "Country": "GH"
                }
            })
            .end((_, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.AppliedFeeID.should.be.eql('LNPY1224');
                res.body.AppliedFeeValue.should.be.eql(100);
                res.body.ChargeAmount.should.be.eql(8000);
                res.body.SettlementAmount.should.be.eql(7900);
                done()
            })
    });
});