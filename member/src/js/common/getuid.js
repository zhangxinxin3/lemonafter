define(function() {
    var getUid = function() {
        var ls = window.localStorage;
        var uid = ls.getItem('uid') || '';
        if (!uid) {
            mui.ajax('/list', {
                type: 'post',
                data: {
                    name: "张"
                },
                success: function(data) {
                    if (data.code == 0) {
                        uid = data.data;
                        ls.setItem('uid', uid)
                    } else {
                        alert(data.message);
                    }
                }
            });
        } else {
            uid = uid;
        }
        return uid
    }
    return getUid;
})