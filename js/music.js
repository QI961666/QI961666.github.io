document.addEventListener('DOMContentLoaded', function () {

    const audio = new Audio('/music/beijingyinyue.mp3');
    audio.loop = true;

    // =========================
    // 可爱粉色唱片
    // =========================

    const musicButton = document.createElement('div');

    musicButton.innerHTML = `
        <div class="cute-record">
            <div class="record-shine"></div>
            <div class="record-center">
                ♡
            </div>
        </div>
    `;

    musicButton.title = '播放音乐';

    musicButton.style.cssText = `
        position: fixed;
        right: 25px;
        bottom: 25px;
        width: 72px;
        height: 72px;
        z-index: 99999;
        cursor: pointer;
        user-select: none;
    `;

    // =========================
    // 唱片样式
    // =========================

    const style = document.createElement('style');

    style.innerHTML = `
        .cute-record {
            position: relative;
            width: 72px;
            height: 72px;
            border-radius: 50%;

            background:
                repeating-radial-gradient(
                    circle,
                    #f8a9c5 0px,
                    #f8a9c5 2px,
                    #f28fb5 3px,
                    #f28fb5 5px
                );

            border: 3px solid #fff;

            box-shadow:
                0 4px 12px rgba(232, 138, 173, 0.35),
                inset 0 0 8px rgba(255,255,255,0.5);

            transition:
                transform 0.25s ease,
                box-shadow 0.25s ease;
        }

        /* 唱片中间 */
        .record-center {
            position: absolute;
            left: 50%;
            top: 50%;

            width: 27px;
            height: 27px;

            transform: translate(-50%, -50%);

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;

            background: #fff1f6;
            color: #e88aad;

            font-size: 17px;
            font-weight: bold;

            border: 2px solid #f6c2d5;

            box-shadow:
                0 0 5px rgba(255,255,255,0.8);
        }

        /* 唱片高光 */
        .record-shine {
            position: absolute;

            width: 18px;
            height: 18px;

            top: 10px;
            left: 16px;

            border-radius: 50%;

            background: rgba(255,255,255,0.45);

            filter: blur(1px);

            transform: rotate(-25deg);
        }

        /* 鼠标放上去 */
        .cute-record:hover {
            transform: scale(1.12) rotate(-5deg);

            box-shadow:
                0 6px 18px rgba(232, 138, 173, 0.45),
                inset 0 0 10px rgba(255,255,255,0.6);
        }

        /* 播放时旋转 */
        .cute-record.playing {
            animation: recordRotate 4s linear infinite;
        }

        @keyframes recordRotate {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(musicButton);

    const record = musicButton.querySelector('.cute-record');

    // =========================
    // 点击播放 / 暂停
    // =========================

    musicButton.addEventListener('click', function () {

        if (audio.paused) {

            audio.play().then(() => {
                record.classList.add('playing');
                musicButton.title = '暂停音乐';
            }).catch(() => {
                console.log('浏览器阻止了音乐播放');
            });

        } else {

            audio.pause();

            record.classList.remove('playing');
            musicButton.title = '播放音乐';
        }

    });

});