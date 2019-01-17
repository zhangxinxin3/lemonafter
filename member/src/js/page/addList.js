require(['../js/config.js'], function() {
    require(['mui', 'getuid', 'picker', 'poppicker'], function(mui, getuid) {
        var img = document.getElementById('img');
        var save = document.querySelector('.save');
        var ls = window.localStorage;
        var type = window.location.search.slice(1).split('=')[1];
        var uid = getuid();
        init();

        function init() {
            mui.ajax('/classify/icon', {
                success: function(data) {
                    if (data.code == 0) {
                        renderIcon(data.data);
                    }
                }
            });
        }

        function renderIcon(data) {
            var pageNum = Math.ceil(data.length / 15);
            var arr = [];
            for (var i = 0; i < pageNum; i++) {
                arr.push(data.splice(0, 15));
            }
            var html = '';
            arr.map(function(v) {
                html += `<div class="mui-slider-item">
                            <div>`;
                v.map(function(item) {
                    html += `<p class="${item.icon}"></p>`
                });
                html += `</div></div>`;
            });
            document.querySelector('.mui-slider-group').innerHTML += html;
            var gallery = mui('.mui-slider');
            gallery.slider({

            });
            addEv();
        };

        function addEv() {
            mui('.mui-slider-group').on('tap', 'p', function() {
                var clas = (this.classList).value;
                img.className = clas;
            })
            save.addEventListener('tap', function() {
                var cname = document.querySelector('.cname').value;
                var iname = (img.classList).value;
                mui.ajax('/classify/add', {
                    data: {
                        iname: iname,
                        cname: cname,
                        type: type,
                        uid: uid
                    },
                    type: 'get',
                    success: function(data) {
                        console.log(data);
                        if (data.code == 0) {
                            location.href = "/pages/addBills.html";
                        } else {
                            alert(data.message);
                        }
                    }
                });
            });
        }
    })
})