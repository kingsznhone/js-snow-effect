(function () {
    // 确保在 window.onload 事件之后执行函数
    function onWindowLoad() {
        return new Promise((resolve) => {
            if (document.readyState === "complete") {
                resolve();
            } else {
                window.addEventListener("load", resolve);
            }
        });
    }

    function SnowManager(imagePath, quantity) {
        this.imagePath = imagePath;
        this.quantity = quantity;
        this.snowflakes = [];
        this.interval = null;
    }

    SnowManager.prototype.init = function () {
        this.interval = setInterval(this.updateSnowflakes.bind(this), 17);
    };

    SnowManager.prototype.updateSnowflakes = function () {
        this.addSnowflake();
        this.removeOrMoveSnowflake();
    };

    SnowManager.prototype.addSnowflake = function () {
        if (this.quantity > this.snowflakes.length && Math.random() < this.quantity * 0.0025) {
            this.snowflakes.push(new Snowflake(this.imagePath));
        }
    };

    SnowManager.prototype.removeOrMoveSnowflake = function () {
        var scrollTop = window.scrollY;
        for (var i = this.snowflakes.length - 1; i >= 0; i--) {
            if (this.snowflakes[i]) {
                if (this.snowflakes[i].top < scrollTop || this.snowflakes[i].top + this.snowflakes[i].size + 1 > scrollTop + window.innerHeight) {
                    this.snowflakes[i].remove();
                    this.snowflakes.splice(i, 1);
                } else {
                    this.snowflakes[i].moveAndDraw();
                }
            }
        }
    };

    // 对外暴露的创建与移除雪花方法
    window.createSnow = function (imagePath, quantity) {
        var manager = new SnowManager(imagePath, quantity);
        onWindowLoad().then(() => manager.init());
    };

    // 雪花对象构造函数
    function Snowflake(imagePath) {
        this.parent = document.body;
        this.createElement(this.parent, imagePath);
        this.size = Math.random() * 20 + 10; // 雪花尺寸为10~30px
        this.el.style.width = Math.round(this.size) + "px";
        this.el.style.height = Math.round(this.size) + "px";
        this.maxLeft = document.body.offsetWidth - this.size;
        this.maxTop = document.body.offsetHeight - this.size;
        this.left = Math.random() * this.maxLeft;
        this.top = window.scrollY + 1;
        this.angle = 1.4 + 0.2 * Math.random();
        this.minAngle = 1.4;
        this.maxAngle = 1.6;
        this.angleDelta = 0.01 * Math.random();
        this.speed = 1 + Math.random();
    }

    // 雪花对象的方法
    Snowflake.prototype = {
        createElement: function (parent, imagePath) {
            this.el = document.createElement("img");
            this.el.setAttribute("src", imagePath + "snow" + Math.floor(Math.random() * 5) + ".gif"); // 修改为雪花文件所在的目录地址
            this.el.style.position = "absolute";
            this.el.style.display = "block";
            this.el.style.zIndex = "50000";
            this.el.style.opacity = "0.5";
            parent.appendChild(this.el);
        },
        moveAndDraw: function () {
            if (this.angle < this.minAngle || this.angle > this.maxAngle) {
            this.angleDelta = -this.angleDelta;
            }
            this.angle += this.angleDelta;
            this.left += this.speed * Math.cos(this.angle * Math.PI);
            this.top -= this.speed * Math.sin(this.angle * Math.PI);
            if (this.left < 0) {
            this.left = this.maxLeft;
            } else if (this.left > this.maxLeft) {
            this.left = 0;
            }
            this.el.style.top = Math.round(this.top) + "px";
            this.el.style.left = Math.round(this.left) + "px";
        },
        remove: function () {
            this.parent.removeChild(this.el);
            this.parent = this.el = null;
        }
    };
})();

// 调用函数创建雪花
createSnow("./", 40);
