/**
 * Retrieve matching fee key for the trnsaction and return null if no match
 * @param {object} tranx transaction to be treated
 * @param {Array} keys for all the fees
 * @returns {String}
 */
const getFeeKey = (tranx, keys) => {

    let locale = tranx['PaymentEntity']['Country'] === "NG" ? "locl" : "intl";
    for (const loc of [locale, "*"]){
        let keyBuilderLoc = `${tranx['Currency']?.toLowerCase()}`;
        let availableKeysLoc = keys;

        //// locale Match
        const filteredKeys = availableKeysLoc.filter(item => item.startsWith(`${keyBuilderLoc}:${loc}`));
        if (filteredKeys === 0){
            continue;   // Move to next loop for no match in current loop
        }

        keyBuilderLoc += `:${loc}`;
        availableKeysLoc = filteredKeys;


        //// Entity Type Match
        const entity = tranx.PaymentEntity.Type.toLowerCase();
        for (const entityType of [entity, "*"]){
            let availableKeysEntity = availableKeysLoc;
            const filteredKeys = availableKeysEntity.filter(item => item.startsWith(`${keyBuilderLoc}:${entityType}`));
            if (filteredKeys === 0){
                continue;   // Move to next loop for no match in current loop
            }

            let keyBuilderEntity = `${keyBuilderLoc}:${entityType}`;
            availableKeysEntity = filteredKeys;

            //// Entity option Match
            let matchKey = availableKeysEntity.find(item => {
                    // Entity possible match
                    return (item.startsWith(`${keyBuilderEntity}(${tranx.PaymentEntity.ID})`) ||
                    item.startsWith(`${keyBuilderEntity}(${tranx.PaymentEntity.Number})`.toLowerCase()) ||
                    item.startsWith(`${keyBuilderEntity}(${tranx.PaymentEntity.SixID})`.toLowerCase()) ||
                    item.startsWith(`${keyBuilderEntity}(${tranx.PaymentEntity.Brand})`.toLowerCase()) ||
                    item.startsWith(`${keyBuilderEntity}(${tranx.PaymentEntity.Issuer})`.toLowerCase()) )
                } );

            if (matchKey){
                return matchKey;
            }

            // Try for generic
            matchKey = availableKeysEntity.find(item => item.startsWith(`${keyBuilderEntity}(*)`));
            if (matchKey){
                return matchKey;
            }
        }
    }

    return null;
}

module.exports = {
                    getFeeKey
            };
