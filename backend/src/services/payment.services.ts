import axios from 'axios';

import * as types from "types/index.types"

async function create(order_code: string, orderData: types.CreatingOrderRequest) {
    // console.log('orderdata:', orderData);
    var partnerCode = process.env.MOMO_PARTNER_CODE as string;
    var accessKey = process.env.MOMO_ACCESS_KEY as string;
    var secretKey = process.env.MOMO_SECRET_KEY as string;
    var orderInfo = 'pay with MoMo user hqh';
    var redirectUrl = '';
    var ipnUrl = `${process.env.HOST_SERVER}${process.env.API_PREFIX}/user/payment/test`;
    var requestType = "payWithMethod";
    var amount = orderData.total_amount as number * 100;
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
    axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log('✅ MoMo response:', response.data);
    }).catch(error => {
        console.error('❌ Lỗi khi gọi MoMo:', error.response?.data || error.message);
    });
}

const payment = {
    create
}

export default payment;