import axios from 'axios';

import * as types from "types/index.types"

async function MoMoMethod(order_code: string, orderData: types.CreatingOrderRequest) {
    var partnerCode = process.env.MOMO_PARTNER_CODE as string;
    var accessKey = process.env.MOMO_ACCESS_KEY as string;
    var secretKey = process.env.MOMO_SECRET_KEY as string;
    var orderInfo = 'pay with MoMo user hqh';
    var redirectUrl = '';
    var ipnUrl = `${process.env.HOST_SERVER}${process.env.API_PREFIX}/user/payment/announce`;
    var requestType = "payWithMethod";
    var amount = (Number(orderData.finalAmount) * 1000).toString() as string;
    var orderId = partnerCode + '-' + order_code;
    var requestId = orderId;
    var extraData = '';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';
    
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log(signature)
    
    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        storeId : "MomoTestStore",
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        lang : lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData : extraData,
        orderGroupId: orderGroupId,
        signature : signature
    });
    try {
        const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return {
            paymentCode: response.data.orderId,
            amount: response.data.amount,
            redirect: true,
            url: response.data.shortLink,
            paymentMethodCode: types.PAYMENT_METHOD.MOMO
        }
    } catch (error: any) {
        console.error('❌ Lỗi khi gọi MoMo:', error.response?.data || error.message);
        throw new Error('Momo Error');
    }
}

async function create(order_code: string, orderData: types.CreatingOrderRequest) {
    switch (orderData.paymentMethodCode) {
        case types.PAYMENT_METHOD.MOMO:
            return await MoMoMethod(order_code, orderData);
        default:
            return {
                paymentCode: order_code,
                amount: orderData.finalAmount,
                redirect: false,
                url: `${process.env.HOST_CLIENT}`,
                paymentMethodCode: types.PAYMENT_METHOD.COD
            };
    }
}

const payment = {
    create
}

export default payment;