# 客户端的开发环境
rollup -w -c ./build/rollup.development.js --environment TARGET:wxsdk
# concurrently -n tsc,dev -c green,yellow "npm run jssdk:tsc" "rollup -w -c ./build/rollup.development.js"