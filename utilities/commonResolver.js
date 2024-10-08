import Message from './messages';
import { successAction, failAction } from './response';
export default async function (req, res, next) {
    try {
        const { body = {}, user = {}, query = {}, params = {},file ={} } = req;
        const { isRequestValidateRequired = false, schemaValidate = {} } = this
        if (isRequestValidateRequired) {
            const { error } = schemaValidate.validate(body)
            if (error) return res.status(400).json(failAction(error.details[0].message.toString().replace(/[\""]+/g, "")))
        }
        this['modelService']({ body, user, query, params, file }).then(
            (success) => {
                if(success.headers?.ContentType == 'text/csv') {
                    res.setHeader('Content-Type', 'text/csv')
                    .setHeader('Content-Disposition', 'attachment; filename=products.csv')
                    .send(success.csvFile)
                }else  if(success.headers?.ContentType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                    .setHeader('Content-Disposition', 'attachment; filename=' + 'employee.xlsx')
                    .send(success.xlsxFile)

                }
                else{
                    res.status(200).json(successAction(success, Message.success)) 
                }
            },
            (error) => {
                console.error("than catch error=>", error)
                let errorMessage = Message[error.message] ? Message[error.message] : error.message
                return res.status(400).json(failAction(errorMessage))
            },
        );
    } catch (e) {
        console.error("catch block error=>", e)
        res.status(400).json(failAction(Message.systemError))
    }
};