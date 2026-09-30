document.addEventListener('click', function (e) {
    const colors = [
        '#f28fb5',
        '#f6a8c4',
        '#f8c8da',
        '#ffd6e8',
        '#ffffff'
    ];

    const symbols = ['♥', '♡', '✦', '✧', '★'];

    for (let i = 0; i < 5; i++) {
        const effect = document.createElement('span');

        effect.innerHTML =
            symbols[Math.floor(Math.random() * symbols.length)];

        effect.style.position = 'fixed';
        effect.style.left =
            e.clientX + 'px';
        effect.style.top =
            e.clientY + 'px';

        effect.style.color =
            colors[Math.floor(Math.random() * colors.length)];

        // 比之前明显一些
        effect.style.fontSize =
            (18 + Math.random() * 10) + 'px';

        effect.style.fontWeight = 'bold';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '99999';

        effect.style.textShadow =
            '0 0 6px rgba(242,143,181,0.7)';

        document.body.appendChild(effect);

        // 向四周爆开
        const angle = Math.random() * Math.PI * 2;
        const distance = 35 + Math.random() * 35;

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance - 20;

        effect.animate(
            [
                {
                    transform: 'translate(-50%, -50%) scale(0.3)',
                    opacity: 0
                },
                {
                    transform: 'translate(-50%, -50%) scale(1.2)',
                    opacity: 1
                },
                {
                    transform:
                        `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0.8)`,
                    opacity: 0
                }
            ],
            {
                duration: 900,
                easing: 'cubic-bezier(.2,.8,.3,1)'
            }
        ).onfinish = () => {
            effect.remove();
        };
    }
});