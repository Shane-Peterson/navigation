document.body.style.minWidth = document.documentElement.clientWidth + 'px'
document.body.style.minHeight = document.documentElement.clientHeight + 'px'

const isTouchDevice = 'ontouchstart' in document.documentElement
const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')[1]
const randomButton = $('.randomButton')
const addButton = $('.addButton')
const localData = localStorage.getItem('localData')
const localDataObject = JSON.parse(localData)
const hashMap = localDataObject || [
  {logo: '#icon-github', url: '//github.com', title: 'Github', logoType: 'svg'}
]
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
let sf
let timer
const simplifyUrl = (url) => {
  return url.replace('https://', '')
    .replace('http://', '')
    .replace('//', '')
    .replace('www.', '')
    .replace(/\/.*/, '')
    .replace(/\..*/, '')
}
const deleteIcon = () => {
  if (isTouchDevice) {
    return `
      <div class="delete delete1">
        <svg class="icon">
          <use xlink:href=#icon-delete1></use>
        </svg>
      </div>
      `
  } else {
    return `
      <div class="delete">
        <svg class="icon">
          <use xlink:href=#icon-delete></use>
        </svg>
      </div>
      `
  }
}
const iconWrapper = (node) => {
  if (node.logoType === 'text') {
    return `<div class="icon">${node.logo}</div>`
  } else if (node.logoType === 'svg') {
    return `<svg class="icon" aria-hidden="true">
      <use xlink:href=${node.logo}></use>`
  } else if (node.logoType === 'image') {
    return `<img class="icon" height="24" width="24" src='//www.google.com/s2/favicons?domain=${node.url}' alt="${node.title}"/>`
  }
}

const render = () => {
  $siteList.find('li:not(.last)').remove()
  hashMap.forEach((node, index) => {
    const $li = $(`<li>
      <div class="site label">
        <div class="icon-wrapper">
            ${iconWrapper(node)}
        </div>
        <div class="text"><span>${node.title}</span></div>
          ${deleteIcon()}
      </div>
    </li>`).insertBefore($lastLi)

    if (isTouchDevice) {
      $li.on('touchend', '.delete1', (e) => {
          e.stopPropagation()
          $li.css('animation', 'scaleBack 0.4s linear 1 forwards')
          setTimeout(() => {
            hashMap.splice(index, 1)
            storage()
            render()
          }, 400)
        }
      )
      $li.on('touchstart', (e) => {
        e.preventDefault()
        timer = Date.now()
        sf = setTimeout(() => {
          $siteList.find('li:not(.last)').each((index, node) => {
            node.classList.add('shake')
          })
          $('.delete1').css('display', 'block')
        }, 700)
      })
      $li.on('touchend', () => {
        timer = Date.now() - timer
        if (timer < 700) {
          clearTimeout(sf)
          changeIcon(node)
        }
        timer = 0;
      })
    } else {
      $li.on('click', (e) => {
        changeIcon(node)
      })
      $li.on('click', '.delete', (e) => {
        e.stopPropagation()
        hashMap.splice(index, 1)
        storage()
        render()
      })
    }

  })
}

render()
$('body').on('click', () => {
  $('.delete1').css('display', 'none')
  $('.shake').removeClass('shake')
})

addButton.on('click', () => {
  let url = window.prompt('请问你要添加的网址是啥？')
  try {
    if (!url.startsWith('http') || !url.startsWith('https')) {
      url = '//' + url
    }
    const title = simplifyUrl(url)
    hashMap.push({logo: `${title[0]}`, url: url, title: title, logoType: 'text'})
    storage()
    render()
  } catch (error) {
  }
})

$(document).on('keypress', (e) => {
  const {key} = e
  if (key === 'a') {
    addButton.trigger('click')
  } else if (key === 'r') {
    randomButton.trigger('click')
  }
  hashMap.forEach((node, index) => {
    if (node.title[0].toLowerCase() === key) {
      $siteList.find('li:not(.last)').each((i, n) => {
        if (i === index) {
          $(n).trigger('click')
          $(n).trigger('touchstart')
          $(n).trigger('touchend')
        }
      })
    }
  })
})

function storage() {
  const string = JSON.stringify(hashMap)
  localStorage.setItem('localData', string)
}

function changeIcon(node) {
  if (node.logoType === 'text') {
    node.logoType = 'image'
  }
  storage()
  window.open(node.url, '_self')
}

$('.searchForm > input').on('keypress', (e) => {
  e.stopPropagation()
})

randomButton.on('click', () => {
  let frequency = getRandomInt(2, 5)
  let url = '//'
  for (let i = 0; i < frequency; i++) {
    url += alphabet[getRandomInt(0, 25)]
  }
  window.open(url + '.com', '_self')
})

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}
