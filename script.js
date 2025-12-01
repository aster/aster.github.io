// ポートフォリオサイト - ミニマリストデザイン

document.addEventListener('DOMContentLoaded', function() {
    // View Projectsボタンのスクロール機能
    const viewProjectsBtn = document.getElementById('viewProjectsBtn');
    if (viewProjectsBtn) {
        viewProjectsBtn.addEventListener('click', function() {
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // マウスカーソルに追従する効果（ヒーローセクション用）
    const heroMinimal = document.querySelector('.hero-minimal');
    if (heroMinimal) {
        heroMinimal.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { offsetWidth, offsetHeight } = heroMinimal;

            const x = (clientX / offsetWidth - 0.5) * 20;
            const y = (clientY / offsetHeight - 0.5) * 20;

            const glitchElement = heroMinimal.querySelector('.glitch');
            if (glitchElement) {
                glitchElement.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
    }

    // プロジェクトカードのホバーエフェクト
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mousemove', function(e) {
            // メディアエリア、テキストエリア（h3, p）、タグエリア、ボタンの場合はホバーエフェクトをスキップ
            if (e.target.closest('.project-media') ||
                e.target.closest('h3') ||
                e.target.closest('p') ||
                e.target.closest('.tags') ||
                e.target.closest('.read-more-btn')) {
                this.style.transform = 'translateY(-10px) rotateX(0) rotateY(0)';
                return;
            }

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });

    // ボタンのリップル効果
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // スクロールアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // アニメーション対象の要素を設定
    const animatedElements = document.querySelectorAll('.project-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // パフォーマンス最適化: デバウンス関数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ウィンドウリサイズ時の処理
    const handleResize = debounce(() => {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // モバイル用の調整（3Dエフェクトを無効化）
            projectCards.forEach(card => {
                card.style.transform = 'none';
            });
        }
    }, 250);

    window.addEventListener('resize', handleResize);

    // もっと見る機能
    document.querySelectorAll('.project-card').forEach(card => {
        const description = card.querySelector('p');
        const readMoreBtn = card.querySelector('.read-more-btn');

        if (description && readMoreBtn) {
            // 説明文が3行を超えているかチェック
            const lineHeight = parseFloat(getComputedStyle(description).lineHeight);
            const maxHeight = lineHeight * 3;

            // 初期状態で高さをチェック（少し遅延させて正確な高さを取得）
            setTimeout(() => {
                if (description.scrollHeight > maxHeight + 5) {
                    readMoreBtn.classList.remove('hidden');
                }
            }, 100);

            // ボタンクリックイベント
            readMoreBtn.addEventListener('click', function(e) {
                e.stopPropagation();

                if (description.classList.contains('expanded')) {
                    description.classList.remove('expanded');
                    this.textContent = 'もっと見る';
                } else {
                    description.classList.add('expanded');
                    this.textContent = '閉じる';
                }
            });
        }
    });
});

// CSS用のリップルスタイルを動的に追加
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    button, .btn-primary, .btn-secondary {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// 画像オーバーレイ機能
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('imageOverlay');
    const overlayContainer = document.querySelector('.overlay-images-container');
    const closeBtn = document.querySelector('.overlay-close');

    // 全ての画像にクリックイベントを追加（iframeは除外）
    document.querySelectorAll('.project-media img').forEach(img => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Image clicked:', this.src); // デバッグ用
            overlay.classList.add('active');

            // コンテナをクリア
            overlayContainer.innerHTML = '';

            // ギャラリー画像がある場合
            const galleryImages = this.dataset.galleryImages;
            if (galleryImages) {
                const images = galleryImages.split(',');
                overlayContainer.classList.add('multiple');

                images.forEach(imgSrc => {
                    const imgElement = document.createElement('img');
                    imgElement.src = imgSrc.trim();
                    imgElement.alt = this.alt;
                    imgElement.className = 'overlay-content';
                    overlayContainer.appendChild(imgElement);
                });
            } else {
                // 単一画像
                overlayContainer.classList.remove('multiple');
                const imgElement = document.createElement('img');
                imgElement.src = this.src;
                imgElement.alt = this.alt;
                imgElement.className = 'overlay-content';
                imgElement.id = 'overlayImg';
                overlayContainer.appendChild(imgElement);
            }

            document.body.style.overflow = 'hidden'; // スクロール無効化
        });
    });

    // オーバーレイを閉じる
    function closeOverlay() {
        overlay.classList.remove('active');
        overlayContainer.classList.remove('multiple');
        document.body.style.overflow = ''; // スクロール有効化
    }

    // 閉じるボタン
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeOverlay();
    });

    // オーバーレイ背景クリックで閉じる
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeOverlay();
        }
    });

    // ESCキーで閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeOverlay();
        }
    });
});
