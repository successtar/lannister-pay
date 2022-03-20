const fs = require("fs");
const {getFeeKey} = require("./Util");

/**
 * Compute Transaction fee
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const computeTransactionFee = (req, res) => {

    const tranx = req.body;
    console.log("New Transaction Fee Computation", {tranx})
    if (tranx.Customer && tranx.PaymentEntity && tranx.Amount > 0 && tranx.Currency){
        // Unsupported currency
        if (tranx.Currency !== "NGN"){
            return res.status(400).json({Error: `No fee configuration for ${tranx.Currency} transactions.`});
        }
        // Retrieve fees from file
        const fees = JSON.parse(fs.readFileSync('fees.json', 'utf8'));
        const key = getFeeKey(tranx, Object.keys(fees));
        // No match found
        if (!key){
            return res.status(406).json({Error: "No matching fee spec for the transaction"});
        }

        const fee = fees[key];
        console.log("Fee retrieved for the transaction", {key, fee, tranx});
        const AppliedFeeValue = fee.flat + ((tranx.Amount * fee.percent)/100);
        const ChargeAmount = tranx.Customer.BearsFee ? (tranx.Amount + AppliedFeeValue) : tranx.Amount;
        const SettlementAmount = ChargeAmount - AppliedFeeValue;
        const response = {
                            AppliedFeeID: fee.feeId,
                            AppliedFeeValue,
                            ChargeAmount,
                            SettlementAmount
                        }

        console.log("Fee Computed Successfully", {response, tranx});
        return res.status(200).json(response);
    }
    else {
        return res.status(400).json({Error: "Invalid Transaction payload"});
    }
}

/**
 * Persist Fee Specifications
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const fees = (req, res) => {

    if (typeof req.body?.FeeConfigurationSpec === "string"){
        console.log("New Fee Configuration Spec", req.body.FeeConfigurationSpec)
        const feesArr = req.body.FeeConfigurationSpec.split("\n");
        // Extract fees to JSON format
        const fees = {};
        for (const fee of feesArr){
            const currFee = fee.split(" ");
            const key = `${currFee[1]}:${currFee[2]}:${currFee[3]}`.toLowerCase();
            let data = {
                feeId: currFee[0]
            }
            if (currFee[6] === "FLAT_PERC"){
                const [flat, percent] = currFee[7].split(":").map(item => Number(item));
                data = {...data, flat, percent};
            }
            else if (currFee[6] === "PERC"){
                data = {...data, flat: 0, percent: Number(currFee[7])};
            }
            else if (currFee[6] === "FLAT"){
                data = {...data, flat: Number(currFee[7]), percent: 0};
            }
            else {
                return res.status(400).json({Error: `Invalid Apply Fee for ${currFee[0]}`})
            }

            fees[key] = data
        }

        // Save to file
        fs.writeFile("fees.json", JSON.stringify(fees), err => {
            if(err) {
                console.log(err);
                return res.status(500).json({Error: err?.message});
            }
            console.log("Fees Spec Updated", {fees})
            return res.status(200).json({status: "ok"});  
        }); 
          
    }
    else {
        return res.status(400).json({Error: "Invalid Fees Payload"});
    }
}


module.exports = {
                    computeTransactionFee,
                    fees
                };