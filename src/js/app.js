const IScroll = require('iscroll')
const $ = window.jQuery
const Headroom = require('headroom.js')

$(() => {
  // headerstyle
  var headstyle = () => {
    var navHeight = $('.header').outerHeight(true)
    $('body').css({'padding-top': navHeight + 'px'})
    if ($('#wpadminbar').length) {
      var barHeight = $('#wpadminbar').height()
      $('.headroom').css({'top': barHeight + 'px'})
    }
  }

  headstyle()
  $(window).on('resize', () => {
    headstyle()
  })

  // sns icon
  if ($('.social-navigation').length) {
    const sns = [
      '500px',
      'codepen',
      'dribbble',
      'facebook',
      'flickr',
      'google',
      'github',
      'instagram',
      'linkedin',
      'npm',
      'pinterest',
      'tumblr',
      'twitter',
      'vimeo',
      'wordpress',
      'youtube',
      'feed'
    ]

    $.each(sns, (i, sns) => {
      $('.sns-menu li').find(`a[href*="${sns}"] use`).attr('xlink:href', `#icon-${sns}`)
    })
  }

  // search-no-results page
  if ($('.search-no-results').length) {
    $('.secondary form[role="search"]').hide()
  }

  var myElement = document.querySelector('.header')
  var headroom = new Headroom(myElement, {
    offset: 100
  })
  headroom.init()

  var Drawer = (() => {
    var myScroll = new IScroll('#site-navigation', {
      mouseWheel: true,
      preventDefault: false
    })

    var setting = {
      class: {
        toggle: 'js-toggle',
        menu: 'gnav',
        ovly: 'bg-ovly',
        open: 'open',
        toggleopen: 'toggle-btn_open',
        bgshow: 'bg-ovly-show',
        fixed: 'bodyfixed'
      }
    }

    function _init () {
      var ovly = '<div class="' + setting.class.ovly + ' ' + setting.class.toggle + '"></div>'
      $('body').append(ovly)

      if ($('.' + setting.class.menu).find('li').length) {
        $('.' + setting.class.toggle).show()
      }
    }

    _init()

    function _toggle () {
      $('.' + setting.class.toggle).on('click', () => {
        if ($('.' + setting.class.menu).attr('aria-expanded') === 'true') {
          $('body').removeClass(setting.class.fixed)
          _close()
        } else {
          $('body').addClass(setting.class.fixed)
          _open()
        }
      })
    }

    function _noScroll () {
      $(document).on('touchmove.noScroll', (e) => {
        e.preventDefault()
      })
    }

    function _returnScroll () {
      $(document).off('.noScroll')
    }

    function _open () {
      myScroll.enable()
      _noScroll()
      $('.' + setting.class.toggle).addClass(setting.class.toggleopen)
      $('.' + setting.class.ovly).addClass(setting.class.bgshow)
      $('.' + setting.class.menu).addClass(setting.class.open).attr('aria-expanded', 'true')
    }

    function _close () {
      myScroll.disable()
      _returnScroll()

      $('.' + setting.class.toggle).removeClass(setting.class.toggleopen)
      $('.' + setting.class.ovly).removeClass(setting.class.bgshow)
      $('.' + setting.class.menu).removeClass(setting.class.open).attr('aria-expanded', 'false')
    }

    return {
      toggle: _toggle
    }
  })()

  Drawer.toggle()
})
