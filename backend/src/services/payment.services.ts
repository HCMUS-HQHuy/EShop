import axios from 'axios';

import * as types from "types/index.types"

async function create(order_id: number, orderData: types.CreatingOrderRequest) {
    // console.log('orderdata:', orderData);
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'pay with MoMo user hqh';
    var partnerCode = 'MOMO';
    var redirectUrl = '';
    var ipnUrl = 'https://f7bf9f643f24.ngrok-free.app/api/v1/user/payment/test';
    var requestType = "payWithMethod"; // captureWallet
    var amount = orderData.total_amount as number * 100;
    var orderId = partnerCode + order_id;
    var requestId = orderId;
    var extraData ='';
    var orderGroupId ='';
    var autoCapture =true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)
    
    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        partnerName : "Test",
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