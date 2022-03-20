## LANNISTER PAY 

(NodeJS Assessment) by Flutterwave

### Problem Statement
https://flutterwave.stoplight.io/docs/f4b-2022-assessment/ZG9jOjM3MTcwMTMz-lannister-pay

### Api Endpoints

Host: https://successtar-lannister-pay.herokuapp.com

* Add Fee Specification

    ```js
    POST: /fees
    {
        "FeeConfigurationSpec": "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"
    }
    ```

* Compute Transation fees

    ```js
    POST: /compute-transaction-fee
    {
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
    }
    ```

[Hammed Olalekan Osanyinpeju](https://successtar.github.io)