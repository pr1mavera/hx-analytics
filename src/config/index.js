/* eslint-disable no-undef */
const env = process.env.NODE_ENV;

const production = {
    // 'public': 'https://112.74.159.153:8085/api/v1'
    'public': 'https://video-uat.ihxlife.com:8085/api/v1'
};

const development = {
    // 'public': 'https://112.74.159.153:8085/api/v1'
    'public': 'https://video-uat.ihxlife.com:8085/api/v1'
};

export default env === 'production' ? production : development;
