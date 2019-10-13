/* eslint-disable no-undef */
const env = process.env.NODE_ENV;

const production = {
    // 生产
    // userPath: 'https://claim.ihxlife.com:8080/api/v1', // 用户服务,整合video-server,chat-server,online
    // webRTCRoomPath: 'https://claim.ihxlife.com:8081/api/v1', // 房间服务
    // TMPath: 'https://claim.ihxlife.com:8082/api/v1' // 腾讯消息服务

    // uat
    'user': 'https://video-uat.ihxlife.com/user-server/api/v1', // 用户服务,整合video-server,chat-server,online
    'RTCRoom': 'https://video-uat.ihxlife.com/room-server/api/v1', // 房间服务
    'TM': 'https://video-uat.ihxlife.com/tm-server/api/v1' // 腾讯消息服务

    // int
    // userPath: 'https://vnap-webrtctest.ihxlife.com/user-server/api/v1', // 用户服务,整合video-server,chat-server,online
    // webRTCRoomPath: 'https://vnap-webrtctest.ihxlife.com/room-server/api/v1', // 房间服务
    // TMPath: 'https://vnap-webrtctest.ihxlife.com/tm-server/api/v1' // 腾讯消息服务
};

const development = {
    'user': 'https://video-uat.ihxlife.com/user-server/api/v1', // 用户服务,整合video-server,chat-server,online
    'RTCRoom': 'https://video-uat.ihxlife.com/room-server/api/v1', // 房间服务
    'TM': 'https://video-uat.ihxlife.com/tm-server/api/v1' // 腾讯消息服务
    // user: 'http://112.74.159.234:8083/api/v1', // 用户服务,整合video-server,chat-server,online
    // RTCRoom: 'http://112.74.229.22:8085/api/v1', // 房间服务
    // TM: 'http://112.74.159.234:8084/api/v1' // 腾讯消息服务
};

export default env === 'production' ? production : development;
