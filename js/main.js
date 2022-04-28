// global key

const TYPE_KEY = Object.freeze({
  sticky: 'sticky',
  normal: 'normal',
});

(() => {
  let yOffset = 0; //window.scrollY
  let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; //현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)

  const sceneInfo = [
    //0
    {
      type: TYPE_KEY.sticky,
      // 브라우저 높이의 5배로 scrollHeight 세팅 (각 기기가 가진 높이를 읽어와서 그 높이 x5를 해줌으로써 여러가지 종류의 디바이스에서 같은 경험을 할 수 있게 해줌)
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-0 .main-message.b'),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        messageD: document.querySelector('#scroll-section-0 .main-message.d'),
      },
      values: {
        messageA_opacity: [0, 1],
      },
    },
    //1
    {
      type: TYPE_KEY.normal,
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1'),
      },
    },
    //2
    {
      type: TYPE_KEY.sticky,
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
      },
    },
    //3
    {
      type: TYPE_KEY.sticky,
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
      },
    },
  ];

  //section height
  function setLayout() {
    //각 스크롤 섹션 높이 셋팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    let totalScrollheight = 0;
    yOffset = window.scrollY;

    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollheight += sceneInfo[i].scrollHeight;
      if (totalScrollheight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.querySelector('body').setAttribute('id', `show-scene-${currentScene}`);
  }

  //scroll
  function scrollLoop() {
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene]?.scrollHeight) {
      currentScene++;
    }
    if (yOffset < prevScrollHeight) {
      if (currentScene === 0) return; // 모바일 브라우저 바운스 효과로인해 음수처리 되는것 방지
      currentScene--;
    }

    document.querySelector('body').setAttribute('id', `show-scene-${currentScene}`);
  }
  // scroll_animation 처리

  function calculateValue(value, currentOffsetY) {
    let rv;
    //현재 scene에서 스크롤된 범위 비율
    let scrollRetio = currentOffsetY / sceneInfo[currentScene].scrollHeight;
    rv = scrollRetio * (value[1] - value[0]) + value[0];
    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentOffsetY = yOffset - prevScrollHeight;

    switch (currentScene) {
      case 0:
        let messageA_opacity_in = calculateValue(values.messageA_opacity, currentOffsetY);
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  }
  window.addEventListener('scroll', () => {
    yOffset = window.scrollY;
    scrollLoop();
    playAnimation();
  });
  window.addEventListener('load', setLayout);
  window.addEventListener('resize', setLayout);
})();
