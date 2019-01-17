require.config({
    baseUrl: "/js/",
    paths: {
        'mui': "libs/mui.min",
        'flex': "libs/flexible",
        'picker': 'libs/mui.picker.min',
        'poppicker': 'libs/mui.poppicker',
        'getuid': "common/getuid",
        'moment': "libs/moment.min"
    },
    shim: {
        'picker': {
            deps: ['mui']
        },
        'poppicker': {
            deps: ['mui']
        }
    }
});