const navs = document.querySelectorAll('nav')
const navToggleButtons = document.querySelectorAll('nav > button')
const subNavToggleButtons = document.querySelectorAll('nav > ul > li > button')
const guestbookPreviewList = document.getElementById('guestbookpreviewlist')
const guestbookPreviews = document.querySelectorAll('#guestbookpreviewlist > li')
const contentPartners = document.querySelectorAll('#contentpartnerslist > p')
const upButton = document.getElementById('up')

navToggleButtons.forEach(function (navToggleButton) {
	navToggleButton.addEventListener('click', e => {
		const isOpen = navToggleButton.getAttribute('aria-expanded') === "false"

		navToggleButton.setAttribute('aria-expanded', isOpen)
	})
})

subNavToggleButtons.forEach(function (subNavToggleButton) {
	subNavToggleButton.addEventListener('click', e => {
		if ( subNavToggleButton.classList.contains('closesubnav') ) {
			subNavToggleButton.classList.remove('closesubnav')
			subNavToggleButton.blur()
		} else {
			subNavToggleButton.classList.add('closesubnav')
		}
	})
})

navs.forEach(function (nav) {
	nav.addEventListener('keyup', e => {
		const navToggleButton = nav.querySelector('nav > button')
		if (e.code === 'Escape') {
			navToggleButton.setAttribute('aria-expanded', false)
			navToggleButton.focus()
		}
	})
})

function gbPreviewsSlide() {
	for (let i = 0, next = 1; i < guestbookPreviews.length; i++, next++) {
		if (guestbookPreviews[i].classList.contains('active')) {
			if (next === guestbookPreviews.length) {
				next = 0
			}

			// Подготовка следующего слайда перед использованием анимации
			guestbookPreviews[next].classList.add('active')

			// Анимирование слайда
			guestbookPreviews[i].classList.add('prev')

			// Удаление устаревших настроек предыдущего слайда после завершения анимации
			setTimeout(function () {
				guestbookPreviews[i].classList.remove('active')
				guestbookPreviews[i].classList.remove('prev')
			}, 1000)

			break
		}
	}
}
let guestbookSliderTimer = setInterval(gbPreviewsSlide, 10000),
	guestbookSliderHovered = false,
	guestbookSliderFocused = false

guestbookPreviewList.onmouseenter = function () {
	guestbookSliderHovered = true
	if (!guestbookSliderFocused) {
		clearInterval(guestbookSliderTimer)
	}
}
guestbookPreviewList.onmouseleave = function () {
	guestbookSliderHovered = false
	if (!guestbookSliderFocused) {
		guestbookSliderTimer = setInterval(gbPreviewsSlide, 10000)
	}
}
guestbookPreviewList.addEventListener('focusin', function () {
	guestbookSliderFocused = true
	if (!guestbookSliderHovered) {
		clearInterval(guestbookSliderTimer)
	}
})
guestbookPreviewList.addEventListener('focusout', function () {
	guestbookSliderFocused = false
	if (!guestbookSliderHovered) {
		guestbookSliderTimer = setInterval(gbPreviewsSlide, 10000)
	}
})

let contentPartnersMinHeight = 0
for (let i = 0; i < contentPartners.length; i++) {
	if (contentPartners[i].offsetHeight > contentPartnersMinHeight)
		contentPartnersMinHeight = contentPartners[i].offsetHeight
}
document.getElementById('contentpartnerslist').style.minHeight = contentPartnersMinHeight + 'px'

function contentPartnersSlide() {
	for (let i = 0, next = 1; i < contentPartners.length; i++, next++) {
		if (contentPartners[i].classList.contains('active')) {
			if (next === contentPartners.length) {
				next = 0
			}

			// Подготовка следующего слайда перед использованием анимации
			contentPartners[next].classList.add('active')

			// Анимирование слайда
			contentPartners[i].classList.add('prev')

			// Удаление устаревших настроек предыдущего слайда после завершения анимации
			contentPartners[i].addEventListener('transitionend', function hideContentPartner() {
				this.removeEventListener('transitionend', hideContentPartner)
				this.classList.remove('active')
				this.classList.remove('prev')
			})

			break
		}
	}
}
let contentPartnersSliderTimer = setInterval(contentPartnersSlide, 5000)

// Смена слайда на получившего фокус партнёра
for (let cp = 0; cp < contentPartners.length; cp++) {
	contentPartners[cp].addEventListener('focusin', function () {
		clearInterval(contentPartnersSliderTimer)
		contentPartnersSliderTimer = setInterval(contentPartnersSlide, 5000)

		// Подготовка следующего слайда перед использованием анимации
		this.classList.add('active')

		// Обработчик события добавлен на случай возвращения фокуса партнёру, находящемуся в процессе скрытия
		this.addEventListener('transitionend', function showContentPartner() {
			this.removeEventListener('transitionend', showContentPartner)
			this.classList.add('active')
		})

		for (let i = 0; i < contentPartners.length; i++) {
			if (contentPartners[i].classList.contains('active') && i !== cp) {
				// Анимирование слайда
				contentPartners[i].classList.add('prev')

				// Удаление устаревших настроек предыдущего слайда после завершения анимации
				contentPartners[i].addEventListener('transitionend', function hideContentPartner() {
					this.removeEventListener('transitionend', hideContentPartner)
					this.classList.remove('active')
					this.classList.remove('prev')
				})
			}
		}
	})
}

// Отображение/скрытие кнопки прокрутки страницы вверх при прокрутке экрана на высоту видимой области окна
let scrollTicking = false
window.onscroll = function () {
	if (document.documentElement.scrollTop > document.documentElement.clientHeight) {
		if (!scrollTicking) {
			scrollTicking = true
			// Обработчик события добавлен на случай быстрой прокрутки страницы вниз, когда кнопка не завершила процесс своего скрытия при прокрутке страницы вверх
			upButton.addEventListener('transitionend', function showUpButton() {
				this.removeEventListener('transitionend', showUpButton)
				this.classList.remove('hidden')
			})
			upButton.classList.remove('hidden')
			setTimeout(function () {
				upButton.classList.add('active')
			})
		}
	} else {
		if (scrollTicking) {
			scrollTicking = false
			upButton.addEventListener('transitionend', function hideUpButton() {
				this.removeEventListener('transitionend', hideUpButton)
				this.classList.add('hidden')
			})
			upButton.classList.remove('active')
		}
	}
}

let scrollTop,
	scrollToTopTimer
function scrollToTop() {
	scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop)
	if (scrollTop > 0)
		window.scrollBy(0, -30)
	else
		clearInterval(scrollToTopTimer)
}
upButton.addEventListener('click', () => {
	scrollToTopTimer = setInterval(scrollToTop, 5)
})
