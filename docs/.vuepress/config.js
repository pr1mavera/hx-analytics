module.exports = {
    title: '华夏官微客户行为数据收集sdk',
    description: 'version 1.0.0',
    // host: '192.168.8.104',
    host: 'localhost',
    port: '8080',
    head: [
        ['link', { rel: 'icon', href: `/favicon.ico` }],
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
    ],
    base: '/hx-analytics/',
    repo: 'https://github.com/pr1mavera/hx-analytics',
    dest: './docs/.vuepress/dist',
    theme: 'reco',
    themeConfig: {
        background: `/img/`,
        github: 'pr1mavera',
        logo: '/img/logo.png',
        accentColor: '#ac3e40',
        lastUpdated: 'Last Updated',
        sidebarDepth: 3,
        date_format: 'yyyy-MM-dd HH:mm:ss',
        smoothScroll: true,
        sidebar: [
            {
                title: '接入文档',
                sidebarDepth: 3,
                children: [
                    '/行为收集接入手册'
                ]
            },
            {
                title: '开发文档',
                sidebarDepth: 3,
                children: [
                    '/开发注意事项',
                    '/项目结构、UML类图及说明',
                    '/指令系统',
                    '/事件上报流程',
                    '/埋点配置流程',
                    '/实现细节'
                ]
            }
        ]
    }
}