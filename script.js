// Конфигурация
const CONFIG = {
    birthday: '2025-10-04', // ЗАМЕНИ на реальную дату рождения
    playlist: [
        {
            id: 1,
            title: 'Давай сконнектимся',
            artist: 'T-Fest',
            cover: 'assets/track1.jpg',
            file: 'audio/T-Fest-Давай сконнектимся.mp3',
            duration: '3:27'
        },
        {
            id: 2,
            title: '1%',
            artist: 'Saluki_Toxi$',
            cover: 'assets/track2.jpg',
            file: 'audio/SALUKI_Toxis-1.mp3',
            duration: '1:53'
        },
        {
            id: 3,
            title: 'Пусто',
            artist: 'V $ X V PRiNCE, BOLLO',
            cover: 'assets/track3.jpg',
            file: 'audio/V_X_V_PRiNCE_BOLLO-Pusto.mp3',
            duration: '3:22'
        },
        {
            id: 4,
            title: 'Dirty',
            artist: 'KRISTIEE',
            cover: 'assets/track4.jpg',
            file: 'audio/KRISTIEE-Dirty.mp3',
            duration: '1:49'
        }
    ]
};

class TimeCapsule {
    constructor() {
        this.audio = new Audio();
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.volume = 0.5;

        this.init();
    }
    autoPlayFirstTrack() {
        setTimeout(() => {
            this.playTrack(0);
        }, 1000);
    }

    init() {
        // Скрываем экран загрузки
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
            this.checkBirthday();
        }, 2000);

        this.setupAudio();
        this.renderPlaylist();
        this.setupEventListeners();
    }

    checkBirthday() {
        const birthday = new Date(CONFIG.birthday);
        const now = new Date();
        
        if (now >= birthday) {
            this.showContent();
        } else {
            this.showCountdown();
            this.startCountdown();
        }
    }

    showCountdown() {
        document.getElementById('countdown-container').classList.remove('hidden');
    }

    showContent() {
        document.getElementById('content-container').classList.remove('hidden');
        this.createConfetti();
        this.autoPlayFirstTrack();
    }

    startCountdown() {
        const update = () => {
            const birthday = new Date(CONFIG.birthday);
            const now = new Date();
            const diff = birthday - now;

            if (diff <= 0) {
                this.showContent();
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        };

        update();
        setInterval(update, 1000);
    }

    setupAudio() {
        this.audio.volume = this.volume;
        
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });

        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audio.addEventListener('ended', () => {
            this.playNext();
        });
    }

    renderPlaylist() {
        const trackList = document.getElementById('track-list');
        trackList.innerHTML = '';

        CONFIG.playlist.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = 'track-item';
            trackElement.innerHTML = `
                <img src="${track.cover}" alt="Обложка" class="track-cover">
                <div class="track-details">
                    <div class="title">${track.title}</div>
                    <div class="artist">${track.artist}</div>
                </div>
                <div class="track-duration">${track.duration}</div>
            `;
            
            trackElement.addEventListener('click', () => {
                this.playTrack(index);
            });
            
            trackList.appendChild(trackElement);
        });
    }

    setupEventListeners() {
        // Кнопки управления
        document.getElementById('play-btn').addEventListener('click', () => {
            this.togglePlay();
        });

        document.getElementById('prev-btn').addEventListener('click', () => {
            this.playPrevious();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.playNext();
        });

        // Громкость
        document.getElementById('volume-slider').addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });

        document.getElementById('mute-btn').addEventListener('click', () => {
            this.toggleMute();
        });
    }

    playTrack(index) {
        this.currentTrackIndex = index;
        const track = CONFIG.playlist[index];
        
        this.audio.src = track.file;
        this.updatePlayerInterface(track);
        
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
            this.highlightCurrentTrack();
        }).catch(error => {
            console.error('Ошибка воспроизведения:', error);
        });
    }

    togglePlay() {
        if (this.audio.src === '') {
            this.playTrack(0);
            return;
        }

        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            this.audio.play();
            this.isPlaying = true;
        }
        
        this.updatePlayButton();
    }

    playNext() {
        const nextIndex = (this.currentTrackIndex + 1) % CONFIG.playlist.length;
        this.playTrack(nextIndex);
    }

    playPrevious() {
        const prevIndex = this.currentTrackIndex - 1 < 0 ? 
            CONFIG.playlist.length - 1 : this.currentTrackIndex - 1;
        this.playTrack(prevIndex);
    }

    setVolume(volume) {
        this.volume = volume;
        this.audio.volume = volume;
        
        // Обновляем иконку mute
        const muteBtn = document.getElementById('mute-btn');
        muteBtn.textContent = volume === 0 ? '🔇' : '🔊';
    }

    toggleMute() {
        this.setVolume(this.volume === 0 ? 0.5 : 0);
        document.getElementById('volume-slider').value = this.volume * 100;
    }

    updatePlayerInterface(track) {
        document.getElementById('current-cover').src = track.cover;
        document.getElementById('current-title').textContent = track.title;
        document.getElementById('current-artist').textContent = track.artist;
    }

    updatePlayButton() {
        const playBtn = document.getElementById('play-btn');
        playBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
    }

    updateProgress() {
        const progressBar = document.getElementById('progress-bar');
        const currentTime = document.getElementById('current-time');
        const duration = document.getElementById('duration');
        
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            progressBar.style.width = `${progress}%`;
            
            currentTime.textContent = this.formatTime(this.audio.currentTime);
            duration.textContent = this.formatTime(this.audio.duration);
        }
    }

    updateDuration() {
        const duration = document.getElementById('duration');
        duration.textContent = this.formatTime(this.audio.duration);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    highlightCurrentTrack() {
        const trackItems = document.querySelectorAll('.track-item');
        trackItems.forEach((item, index) => {
            if (index === this.currentTrackIndex) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }

    createConfetti() {
        // Простая анимация конфетти
        const confetti = document.querySelector('.confetti');
        if (confetti) {
            setInterval(() => {
                confetti.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random() * 0.4})`;
            }, 1000);
        }
    }
}

// Функции для модального окна галереи
function openModal(img) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const caption = document.getElementById('modal-caption');
    
    modal.classList.remove('hidden');
    modalImg.src = img.src;
    caption.textContent = img.parentElement.querySelector('.photo-caption').textContent;
}

function closeModal() {
    document.getElementById('image-modal').classList.add('hidden');
}

// Закрытие модального окна по клику вне изображения
document.getElementById('image-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new TimeCapsule();

});
